export const mockStreamingResponse = async (prompt: string, onChunk: (chunk: string) => void) => {
  // Simulate streaming for the UI
  const words = `This is a mocked response for: "${prompt}". NEXUS is designed to handle multi-model orchestration and visual workflows. In a real integration, this would be streaming from an LLM provider like OpenAI, Anthropic, or Gemini.`.split(" ");

  for (let i = 0; i < words.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 100));
    onChunk(words[i] + " ");
  }
};

export const tools = [
  { id: 'web-search', name: 'Web Search', description: 'Search the web for real-time information', icon: 'Search' },
  { id: 'js-executor', name: 'JS Executor', description: 'Run sandboxed JavaScript code', icon: 'Code' },
  { id: 'image-gen', name: 'Image Gen', description: 'Generate images from text descriptions', icon: 'Image' },
  { id: 'data-viz', name: 'Data Viz', description: 'Create charts and visualizations', icon: 'BarChart' },
];

export const agents = [
  { id: 'researcher', name: 'Researcher', description: 'Specialized in deep research and synthesis', systemPrompt: 'You are a research assistant...' },
  { id: 'coder', name: 'Code Expert', description: 'Expert in multiple programming languages', systemPrompt: 'You are a senior software engineer...' },
];
