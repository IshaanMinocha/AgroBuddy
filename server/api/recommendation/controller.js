import axios from 'axios';
import { cropRecommendationPrompt, diseaseDetectionPrompt, yieldPredictionPrompt } from '../../utils/prompt.js';

const openaiUrl = process.env.OPENAI_API_URL;
const openaiKey = process.env.OPENAI_API_KEY;

export const chatCompletion = async (req, res) => {
    try {
        const { prompt, usecase } = req.body;
        if (!prompt) {
            return res.status(400).json({ success: false, error: 'prompt body missing' });
        }
        let content;
        switch (usecase) {
            case 'yield':
                content = yieldPredictionPrompt + prompt;
                break;
            case 'crop':
                content = cropRecommendationPrompt + prompt;
                break;
            case 'disease':
                content = diseaseDetectionPrompt + prompt;
                break;
            default:
                return res.status(400).json({ success: false, error: 'usecase not found' });
        }
        console.log(req.body, "req.body");
        console.log(prompt, "prompt");
        console.log(usecase, "usecase");
        console.log(content, "content");

        const openaiResponse = await axios.post(
            `${openaiUrl}/v1/chat/completions`,
            {
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: 'You are a knowledgeable agricultural advisor.' },
                    { role: 'user', content: content },
                ],
                temperature: 0.7
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${openaiKey}`,
                },
            }
        );

        const answer = openaiResponse.data.choices[0].message.content;
        console.log(answer);
        res.status(200).json({ success: true, answer });
    } catch (error) {
        console.error('Processing query error:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, error: 'Server error processing query' });
    }
};