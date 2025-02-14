import Transcription from './model.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { processQueryPrompt } from '../../utils/prompt.js';

const openaiUrl = process.env.OPENAI_API_URL;
const openaiKey = process.env.OPENAI_API_KEY;

export const sendVoice = async (req, res) => {
    console.log("sendVoice");
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        console.log(file, "file on server")

        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, `audio_${Date.now()}.m4a`);
        fs.writeFileSync(tempFilePath, file.buffer);

        const formData = new FormData();
        formData.append('file', fs.createReadStream(tempFilePath));
        formData.append('model', 'whisper-1');
        formData.append('temperature', '0.1');

        console.log(formData, "formData");

        const openaiResponse = await axios.post(
            `${openaiUrl}/v1/audio/transcriptions`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    Authorization: `Bearer ${openaiKey}`,
                },
            }
        );

        fs.unlinkSync(tempFilePath);

        // const dbtranscription = await Transcription.create({
        //     userId,
        //     botResponse,
        //     userQuery
        // });


        const transcription = openaiResponse.data.text;
        console.log(transcription, "firstTranscription");

        res.status(201).json({
            success: true,
            data: transcription
        });

    } catch (error) {
        console.error('Transcription error:', error.response ? error.response.data : error.message);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });

    }

};

export const processQuery = async (req, res) => {
    try {
        const { transcription, model } = req.body;
        if (!transcription) {
            return res.status(400).json({ success: false, error: 'No transcription provided' });
        }

        const prompt = processQueryPrompt + transcription
        console.log('Prompt:', prompt);

        const openaiResponse = await axios.post(
            `${openaiUrl}/v1/chat/completions`,
            {
                model: model || 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a knowledgeable agricultural advisor.' },
                    { role: 'user', content: prompt },
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
        res.status(200).json({ success: true, answer });
    } catch (error) {
        console.error('Processing query error:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, error: 'Server error processing query' });
    }
};


export const getVoice = async (req, res) => {
    try {
        const transcriptions = await Transcription.find({ userId: req.user._id });

        res.status(200).json({
            success: true,
            data: transcriptions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
