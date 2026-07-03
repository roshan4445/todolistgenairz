const groq = require("../utils/groq.js");
const Task = require("../models/taskModel");

module.exports.GetSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const tasks = await Task.find({ user: userId });

        const prompt = `You are an expert productivity coach.

Your job is NOT to summarize tasks.

Your job is to make the user immediately understand their day in under 10 seconds.

Keep it short.

Use emojis naturally.

Mention:
- greeting
- today's workload
- important tasks
- overdue tasks if any
- one clear focus
- one motivational sentence

Rules:
- Maximum 80 words.
- No markdown.
- No long paragraphs.
- Sound energetic but professional.
- Never list every task.
- Mention only the tasks that deserve attention.

Here are the user's tasks:
${JSON.stringify(tasks, null, 2)}
`;

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a productivity assistant."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        const summary = response.choices[0].message.content;

        return res.status(200).json({
            success: true,
            summary
        });

    }
    catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error fetching task summary",
            error: error.message
        });

    }
};