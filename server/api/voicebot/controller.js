// import Transcription from './model.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { processQueryPrompt } from '../../utils/prompt.js';

const openaiUrl = process.env.OPENAI_API_URL;
const openaiKey = process.env.OPENAI_API_KEY;
const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
const elevenLabsVoiceId = process.env.ELEVENLABS_VOICE_ID;
const elevenLabsApiUrl = process.env.ELEVENLABS_API_URL;

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
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }

        const voiceId = elevenLabsVoiceId;

        const payload = {
            text,
            model_id: "eleven_multilingual_v2",
        };

        const elevenResponse = await axios.post(
            `${elevenLabsApiUrl}/v1/text-to-speech/${voiceId}`,
            payload,
            {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': elevenLabsKey,
                    Accept: 'audio/mpeg',
                },
            }
        );

        const audioBuffer = Buffer.from(elevenResponse.data, 'binary');
        const base64Audio = audioBuffer.toString('base64');

        res.json({ audio: base64Audio });
    } catch (error) {
        console.error('TTS error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'TTS error' });
    }
};
