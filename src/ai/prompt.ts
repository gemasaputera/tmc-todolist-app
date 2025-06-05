type CategoryPrompts = 'travel' | 'skill' | 'health' | 'home' | 'finance';

export function createOptimizedPrompt(
  category: CategoryPrompts,
  input: string
) {
  const basePrompts = {
    travel: `Create a trip planning checklist for ${input}.`,
    skill: `Create a learning path for mastering ${input}.`,
    health: 'Create a balanced health and fitness routine.',
    home: 'Create home organization and improvement tasks.',
    finance: 'Create financial wellness action items.'
  };
  const now = new Date();

  return `${basePrompts[category]}
  
  Generate exactly 5 actionable todos after this day ${now.toISOString()}. Each should be specific, measurable, and achievable.
  
  Return ONLY a JSON array with this exact structure:
  [
    {
      "task": "Clear, specific action to take",
      "priority": "high, medium, or low",
      "dueDate": "YYYY-MM-DD"
    }
  ]
  
  Make tasks progressive (start easy, build up).`;
}
