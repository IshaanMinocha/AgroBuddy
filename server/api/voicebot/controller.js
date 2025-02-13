import Transcription from './model.js';

export const sendVoice = async (req, res) => {
    const { userId, botResponse, userQuery } = req.body;

    try {
        const transcription = await Transcription.create({
            userId,
            botResponse,
            userQuery
        });

        res.status(201).json({
            success: true,
            data: transcription
        });
    } catch (error) {
        console.error(error);
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
