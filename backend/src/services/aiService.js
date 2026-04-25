const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.validatePrescription = async (prescriptionData) => {
  const systemPrompt = `You are a clinical safety assistant.
Your job is to analyze prescriptions for safety.

STRICT RULES:
- Identify drug-drug interactions
- Identify dangerous combinations
- Flag kidney, liver, heart risks
- Be conservative: if unsure, mark as potentially unsafe
- DO NOT assume patient is safe

OUTPUT FORMAT (STRICT JSON):
{
  "isSafe": boolean,
  "issues": [
    {
      "problem": "...",
      "severity": "low | medium | high",
      "reason": "..."
    }
  ],
  "explanation": "...",
  "suggestions": [
    "..."
  ]
}`;

  const userPrompt = `Please analyze the following prescription for safety:\n\n${JSON.stringify(prescriptionData, null, 2)}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" }
  });

  const aiContent = response.choices[0].message.content;
  return JSON.parse(aiContent);
};
