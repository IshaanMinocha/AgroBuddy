
export async function espAction(req, res){
    try{
        const {action} = req.body;
        if(!action){
            return res.status(400).json({ success: false, error: 'Action is required' });
        }
        console.log('Action:', action);
        // call api for action;
    }catch(e){
        console.error('Processing query error:', e.response ? e.response.data : e.message);
        res.status(500).json({ success: false, error: 'Server error processing query' });
    }
}