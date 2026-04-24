const Groq = require('groq-sdk');
const Patient = require('../models/Patient');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const demoPrescription = {
  doctorName: "Dr. Amit Verma",
  diagnosis: "Type 2 Diabetes + Hypertension + Pain",
  medications: [
    { medicineName: "Metformin", dosage: "500mg", duration: "30 days" },
    { medicineName: "Ibuprofen", dosage: "400mg", duration: "10 days" },
    { medicineName: "Lisinopril", dosage: "10mg", duration: "30 days" },
    { medicineName: "Spironolactone", dosage: "25mg", duration: "30 days" },
    { medicineName: "Potassium Supplements", dosage: "20mEq", duration: "30 days" }
  ],
  issuedDate: "2024-04-01T10:00:00.000Z",
  validTill: "2024-05-01T10:00:00.000Z"
};

exports.checkPrescription = async (req, res) => {
  try {
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({ error: "patientId is required in the request body" });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

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

    const userPrompt = `Please analyze the following prescription for safety:\n\n${JSON.stringify(demoPrescription, null, 2)}`;

    console.log("====================================");
    console.log("Sending demo prescription to Groq AI for validation...");

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const aiContent = response.choices[0].message.content;
    console.log("AI Raw Response received:\n", aiContent);

    let aiResult;
    try {
      aiResult = JSON.parse(aiContent);
    } catch (parseError) {
      console.error("Failed to parse AI JSON response:", parseError);
      return res.status(500).json({ error: "AI returned invalid JSON format" });
    }

    // 5. IF safe -> store in MongoDB
    // 6. IF unsafe -> DO NOT store
    if (aiResult.isSafe === true) {
      patient.prescriptions.push(demoPrescription);
      await patient.save();
      console.log("✅ Prescription marked SAFE and saved to patient record.");
    } else {
      console.log("❌ Prescription marked UNSAFE. Database was NOT modified.");
    }
    console.log("====================================");

    return res.json(aiResult);

  } catch (error) {
    console.error("Error in prescription controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
