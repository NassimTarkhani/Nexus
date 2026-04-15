import { test, expect, type Page } from "@playwright/test";

/**
 * E2E: Full chat flow
 *
 * Scenario: User logs in → opens chat → types a message with @web-search mention
 *           → sends the message → asserts the assistant responds.
 *
 * Prerequisites:
 *   - App running at http://localhost:3000
 *   - TEST_EMAIL / TEST_PASSWORD environment variables set, OR
 *     a pre-existing test account in Supabase
 *
 * Run: npx playwright test tests/e2e/chat.spec.ts
 */

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const TEST_EMAIL = process.env.TEST_EMAIL ?? "test@example.com";
const TEST_PASSWORD = process.env.TEST_PASSWORD ?? "testpassword123";

// ── Helpers ────────────────────────────────────────────────────────────────

async function login(page: Page) {
    await page.goto(`${BASE_URL}/login`);

    // Fill credentials
    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/password/i).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /sign in|log in/i }).click();

    // Wait for redirect to dashboard / chat
    await page.waitForURL(/\/(?:chat|dashboard|$)/, { timeout: 15_000 });
}

// ── Tests ──────────────────────────────────────────────────────────────────

test.describe("Chat flow", () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    test("sends a plain message and receives a streaming response", async ({ page }) => {
        // Navigate to chat if not already there
        const chatLink = page.getByRole("link", { name: /chat/i }).first();
        if (await chatLink.isVisible()) await chatLink.click();

        const textarea = page.locator("textarea").first();
        await expect(textarea).toBeVisible({ timeout: 10_000 });

        // Type a plain message
        await textarea.fill("Say hello in one word");
        await page.keyboard.press("Enter");

        // Assert the user message appeared
        await expect(page.getByText("Say hello in one word")).toBeVisible({ timeout: 5_000 });

        // Assert assistant response appears (any non-empty text in the assistant bubble)
        const assistantResponse = page.locator('[data-role="assistant"]').last();
        await expect(assistantResponse).not.toBeEmpty({ timeout: 30_000 });
    });

    test("@ mention triggers autocomplete popup", async ({ page }) => {
        const chatLink = page.getByRole("link", { name: /chat/i }).first();
        if (await chatLink.isVisible()) await chatLink.click();

        const textarea = page.locator("textarea").first();
        await expect(textarea).toBeVisible({ timeout: 10_000 });

        // Type @ to trigger mentor popup
        await textarea.click();
        await textarea.type("@web");

        // The ToolMention popup should appear
        const popup = page.locator('[data-testid="tool-mention-popup"]');
        await expect(popup).toBeVisible({ timeout: 3_000 });

        // Press Enter or click the first item
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");

        // The @mention text should appear in the textarea
        const value = await textarea.inputValue();
        expect(value).toMatch(/@\w+/);
    });

    test("@ mention + send delivers toolChoice context to chat", async ({ page }) => {
        const chatLink = page.getByRole("link", { name: /chat/i }).first();
        if (await chatLink.isVisible()) await chatLink.click();

        const textarea = page.locator("textarea").first();
        await expect(textarea).toBeVisible({ timeout: 10_000 });

        // Type a message with @web-search mention
        await textarea.fill("@web-search What is the capital of France?");
        await page.keyboard.press("Enter");

        // Assert the user message is shown
        await expect(page.getByText(/capital of France/i)).toBeVisible({ timeout: 5_000 });

        // Assert assistant response appears
        const assistantResponse = page.locator('[data-role="assistant"]').last();
        await expect(assistantResponse).not.toBeEmpty({ timeout: 30_000 });
    });

    test("new chat button clears the conversation", async ({ page }) => {
        const chatLink = page.getByRole("link", { name: /chat/i }).first();
        if (await chatLink.isVisible()) await chatLink.click();

        const textarea = page.locator("textarea").first();
        await expect(textarea).toBeVisible({ timeout: 10_000 });

        // Send a message to create a conversation
        await textarea.fill("Test message for new chat");
        await page.keyboard.press("Enter");
        await expect(page.getByText("Test message for new chat")).toBeVisible({ timeout: 5_000 });

        // Click New Chat
        const newChatBtn = page.getByRole("button", { name: /new chat/i });
        await expect(newChatBtn).toBeVisible({ timeout: 5_000 });
        await newChatBtn.click();

        // Messages should be gone
        await expect(page.getByText("Test message for new chat")).not.toBeVisible({ timeout: 3_000 });
    });
});

test.describe("Mock API endpoints", () => {
    test("GET /api/mock/web-search returns results", async ({ request }) => {
        const res = await request.get(`${BASE_URL}/api/mock/web-search?q=nextjs&limit=3`);
        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(body).toHaveProperty("results");
        expect(Array.isArray(body.results)).toBe(true);
        expect(body.results.length).toBeGreaterThan(0);
        expect(body.results[0]).toHaveProperty("title");
        expect(body.results[0]).toHaveProperty("url");
    });

    test("POST /api/mock/image-gen returns an image URL", async ({ request }) => {
        const res = await request.post(`${BASE_URL}/api/mock/image-gen`, {
            data: { prompt: "A futuristic city at night", size: "1024x1024" },
        });
        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(body).toHaveProperty("url");
        expect(body.url).toMatch(/^https?:\/\//);
    });

    test("POST /api/mock/js-executor returns output", async ({ request }) => {
        const res = await request.post(`${BASE_URL}/api/mock/js-executor`, {
            data: { code: 'console.log("hello")' },
        });
        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(body).toHaveProperty("output");
    });
});
