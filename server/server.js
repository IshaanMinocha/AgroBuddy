import express from 'express';
import envConfig from './config/dotenv.js';
import connectDb from './config/db.js';
import cors from 'cors';
import userRouter from './api/user/route.js';
import voicebotRouter from './api/voicebot/route.js';
import recommendationRouter from './api/recommendation/route.js';
import espActionRouter from './api/esp-action/route.js';
import getWeatherDataRouter from './api/get-weather-data/route.js';
import getMoistureRouter from './api/moisture/route.js';
envConfig();

const app = express();

const port = process.env.PORT || 8000;

app.use(cors({
    origin: '*'
}));
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/voicebot', voicebotRouter);
app.use('/api/recommendation', recommendationRouter);
app.use('/api/esp-action', espActionRouter)
app.use('/api/getWeatherData', getWeatherDataRouter);
app.use('/api/getMoisture', getMoistureRouter);

const startServer = async () => {
    try {
        await connectDb();
        app.listen(port, () =>
            console.log(`Server running on port http://localhost:${port}`)
        )
    } catch (error) {
        console.error('DB connection failed:', error.message);
    }
};

startServer();

app.get('/', (req, res) => {
    res.json({ success: true, message: 'server up!' })
})