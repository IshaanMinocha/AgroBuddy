
export async function getMoisture(req, res) {
    try{

    }catch(e){
        console.error('Processing Moisture query error:', e.response ? e.response.data : e.message);
        res.status(500).json({ success: false, error: 'Server error processing moisture query' });
    }
}