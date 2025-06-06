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
  
  Generate exactly 4 actionable todos with duedate after this day ${now.toISOString()}. Each should be relatable, specific, measurable, and achievable. 
  For sub tasks count is based on how complex the task is.
  For example, if the task is "Learn a new language", then the sub tasks should be "Learn the language grammar", "Learn the language vocabulary", "Learn the language pronunciation", "Learn the language culture", "Learn the language customs", "Learn the language traditions", "Learn the language customs", "Learn the language traditions", "Learn the language customs", "Learn the language traditions".
  If the task do not have sub tasks, then the sub tasks should be empty.

  Each todo should have a priority level of 4 (high priority), 3(medium priority), 2(low priority) or 1(very low priority).
  The priority level should be based on the complexity of the task.
  For example, if the task is "Learn a new language", then the priority level should be 4(high).
  if the task is "drink 2 cups of water", then the priority level should be 1(very low).
  
  CRITICAL REQUIREMENTS:
  - Return ONLY valid, complete JSON
  - No explanations, no markdown, no extra text
  - Ensure the JSON is properly closed with ]
  - Keep all text very short to avoid truncation
  
  Return ONLY a JSON array with this exact structure:
  [
    {
      "task": "Brief action (max 80 chars)",
      "priority": 1,
      "dueDate": "YYYY-MM-DD",
      "subTodos": [
        {
          "description": "Sub-task 1 (max 50 chars)",
          "checked": false
        },
        {
          "description": "Sub-task 2 (max 50 chars)",
          "checked": false
        },
        ...relevant sub tasks (if any)
      ]
    }
  ]
  
  STRICT RULES:
  - Only 4(high priority), 3(medium priority), 2(low priority) or 1(very low priority) for priority
  - YYYY-MM-DD format for dates
  - No trailing commas
  - Double quotes only
  - Complete valid JSON ending with ]
  - Very short descriptions to prevent truncation`;
}
