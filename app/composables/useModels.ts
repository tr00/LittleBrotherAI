export function useModels() {
  const models = [
    // Tier 1 - Fast & Cheap
    'openai/gpt-4o-mini',
    'anthropic/claude-3-5-haiku',
    'google/gemini-2.0-flash-exp',

    // Tier 2 - Balanced
    'openai/gpt-4o',
    'anthropic/claude-3-5-sonnet',
    'google/gemini-exp-1206',

    // Tier 3 - Powerful
    'openai/o1',
    'anthropic/claude-opus-4-20250514',
    'google/gemini-pro-1.5',

    // Tier 4 - Open Source
    'meta-llama/llama-3.3-70b-instruct',
    'deepseek/deepseek-r1'
  ]

  const model = useCookie<string>('model', { default: () => 'openai/gpt-4o-mini' })

  return {
    models,
    model
  }
}
