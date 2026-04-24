const Patient = require('../models/Patient');
const Groq = require('groq-sdk');

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.handleChat = async (req, res) => {
  try {
    const { patientId, message } = req.body;

    if (!patientId || !message) {
      return res.status(400).json({ error: "patientId and message are required" });
    }

    // 1. Fetch Patient Data
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // 2. Build Optimized Context
    const diseaseNames = patient.currentDiseases.map(d => d.diseaseName);
    const medicineNames = patient.currentMedications.map(m => m.medicineName);
    const allergies = patient.allergies;
    
    // Get last 2 AI history entries ONLY
    const recentHistory = patient.aiHistory.slice(-2);

    // 3. Construct AI Prompt
    const systemMessage = `You are a cautious medical assistant.
- Do NOT give definitive medical advice
- Highlight risks clearly
- Suggest consulting a doctor if needed
- Keep answers simple and clear`;

    const userMessage = `Patient Context:
Age: ${patient.age}
Category: ${patient.ageCategory || 'N/A'}
Diseases: ${diseaseNames.length > 0 ? diseaseNames.join(', ') : 'None'}
Medications: ${medicineNames.length > 0 ? medicineNames.join(', ') : 'None'}
Allergies: ${allergies.length > 0 ? allergies.join(', ') : 'None'}

Recent Context:
${recentHistory.length > 0 ? recentHistory.map((h, i) => `History ${i+1}:\nQ: ${h.prompt}\nA: ${h.aiResponse}`).join('\n\n') : 'None'}

Question:
${message}`;

    // 4. Integrate Groq API
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ]
    });

    const aiReply = response.choices[0].message.content;

    // 5. Risk Classification
    let riskLevel = "Low";
    const lowerReply = aiReply.toLowerCase();
    if (lowerReply.includes("danger") || lowerReply.includes("unsafe")) {
      riskLevel = "High";
    } else if (lowerReply.includes("caution") || lowerReply.includes("monitor")) {
      riskLevel = "Moderate";
    }

    // 6. Store Interaction
    patient.aiHistory.push({
      prompt: message,
      contextUsed: {
        diseases: diseaseNames,
        medications: medicineNames,
        allergies: allergies
      },
      aiResponse: aiReply,
      riskLevel: riskLevel,
      timestamp: new Date()
    });

    await patient.save();

    // 7. Response Format
    return res.json({
      reply: aiReply,
      riskLevel: riskLevel
    });

  } catch (error) {
    console.error("Error in chat controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
