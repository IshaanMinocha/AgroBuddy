import Transcription from './model.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import os from 'os';

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
    const { userQuery } = req.body;

    const botResponse = `Processed: ${userQuery}`;

    res.status(200).json({
        success: true,
        botResponse
    });
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
