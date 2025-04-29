
export async function getWeatherData(req, res) {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ success: false, error: 'Latitude and longitude are required' });
    }
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_API_KEY}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        res.status(200).json({ success: true, data : {
            temperature: data.main.temp,
            humidity: data.main.humidity,

        }});
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ success: false, error: 'Server error fetching weather data' });
    } 
}