import axios from 'axios';
import asyncHandler from 'express-async-handler';

const getMoisture = asyncHandler(async (req, res) => {

    const esp32Ip = process.env.ESP32_IP;

    try {
        const response = await axios.get(`${esp32Ip}`, { timeout: 2000 });

        if (!response.data.moisture) {
            throw new Error('moisture not available');
        }

        res.status(200).json({
            moisture: response.data.moisture,
            success: true,
            message: "Sent successfully"
        });
    } catch (error) {
        console.error("Failed to fetch from ESP32:", err.message);
        res.status(500).json({ error: "Failed to get data from ESP32" });
    }
});

export { getMoisture };