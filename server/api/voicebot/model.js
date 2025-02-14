import mongoose from 'mongoose';

const transcriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    userQuery: {
        type: String,
        required: true
    },
    botResponse: {
        type: String,
        required: true
    },
}, {
    collection: 'Transcriptions',
    timestamps: true
});

const Transcription = mongoose.model('Transcription', transcriptionSchema);

export default Transcription;

