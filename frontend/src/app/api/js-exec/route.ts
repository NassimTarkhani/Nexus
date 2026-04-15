import { NextRequest, NextResponse } from "next/server";
import vm from "vm";

// Must run on Node.js — vm is not available in edge runtime
export const runtime = "nodejs";

/**
 * POST /api/js-exec
 * Body: { code: string; timeout?: number }
 *
 * Executes JavaScript in a sandboxed Node.js vm context.
 * stdout/console.log calls are captured and returned.
 * Dangerous APIs (fs, process, child_process) are not available in the sandbox.
 */
export async function POST(req: NextRequest) {
    let body: { code?: string; timeout?: number };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { code, timeout = 5000 } = body;

    if (!code?.trim()) {
        return NextResponse.json({ error: "Missing required field: code" }, { status: 400 });
    }

    const logs: string[] = [];

    const sandbox = {
        console: {
            log: (...args: unknown[]) => logs.push(args.map(String).join(" ")),
            warn: (...args: unknown[]) => logs.push("[warn] " + args.map(String).join(" ")),
            error: (...args: unknown[]) => logs.push("[error] " + args.map(String).join(" ")),
            info: (...args: unknown[]) => logs.push("[info] " + args.map(String).join(" ")),
        },
        JSON,
        Math,
        Date,
        Array,
        Object,
        String,
        Number,
        Boolean,
        parseInt,
        parseFloat,
        isNaN,
        isFinite,
        encodeURIComponent,
        decodeURIComponent,
        setTimeout: undefined as unknown,
        setInterval: undefined as unknown,
        fetch: undefined as unknown,
        require: undefined as unknown,
        process: undefined as unknown,
        __result: undefined as unknown,
    };

    try {
        // Wrap code to capture expression result
        const wrappedCode = `
            __result = (function() {
                ${code}
            })();
        `;

        const context = vm.createContext(sandbox);
        const script = new vm.Script(wrappedCode);
        script.runInContext(context, { timeout });

        const output = logs.join("\n");
        const result = sandbox.__result;

        return NextResponse.json({
            output: output || (result !== undefined ? String(result) : ""),
            result: result !== undefined ? result : null,
            logs,
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Execution error";
        const isTimeout = message.includes("timed out") || message.includes("Script execution timed out");
        return NextResponse.json(
            {
                error: isTimeout ? `Execution timed out after ${timeout}ms` : message,
                output: logs.join("\n"),
                logs,
            },
            { status: isTimeout ? 408 : 400 }
        );
    }
}
