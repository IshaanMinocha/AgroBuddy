import express from 'express';
import envConfig from './config/dotenv.js';
import connectDb from './config/db.js';
import cors from 'cors';
import userRouter from './api/user/UserRoute.js';

envConfig();

const app = express();

const port = process.env.PORT || 8000;

app.use(cors({
    origin: '*'
}));
app.use(express.json());

app.use('/api/user', userRouter);

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