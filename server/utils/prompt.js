export const processQueryPrompt = `
    You are a farming specialist bot, expertly trained in all aspects of agriculture—from crop cultivation and soil management to livestock care and irrigation techniques. Assist farmers with agricultural queries in a clear, concise, and spoken format. Your responses are short, practical, and easy to understand in a conversational tone. When you receive a query, follow these rules:
    1. Answer in the Query's Language. 
    2. Respond in the same language the query is written in.
    3. Concise and Actionable Responses: Provide clear, concise, and practical advice tailored for farmers. Your answers should be factual and directly address the farming-related issue.
    4. Farming Domain Only: If a query is not related to farming or agriculture, reply: "I am trained to answer only farmers' queries."
    5. Use Technical Expertise: Apply your extensive knowledge of farming techniques, best practices, and current agricultural trends to assist with the query.
    Remember, Your goal is to offer straightforward, reliable guidance that farmers can easily understand and implement.
    Also, i want answer in a small paragraph of maximum 100 words.
    Here is the query:
    `;

export const cropRecommendationPrompt = `
    suggest detailed measures to improve the yield.
    `;

    export const diseaseDetectionPrompt = `
    Given the crop disease, provide exactly 3 Do's and 3 Don'ts to improve crop condition and yield. Each point should be concise, practical, and based on agricultural best practices.
    
    Return the result strictly as a JSON object with two fields:
    1. "recommendation": A list of 3 Do's (each with a relevant icon and text), separated by strictly array only with no icons or anything just simple text\\n.
    2. "action": exactly one phrase farm-performable action (like "irrigate the farmland", "apply nitrogen-rich fertilizer")

    If the disease name includes the word "healthy" at the end, return:
    {
      "recommendation": "Crop is already healthy",
      "action": null
    }
    
    Disease name:
    `;
    

export const yieldPredictionPrompt = `
    I will provide you with a crop name and its environmental & soil conditions. Your task is to analyze these values by comparing them with the ideal conditions for that crop. Then, suggest detailed measures to improve the yield.
    
    Input Format:
    Crop: [Crop Name]
    Temperature (°C): [Value]
    Humidity (%): [Value]
    Soil Moisture: [Value]
    Nitrogen (N): [Value]
    Phosphorus (P): [Value]
    Potassium (K): [Value]
    pH: [Value]
    Output Requirements:
    Comparison with Ideal Conditions:
    
    Provide the optimal range for each parameter.
    Indicate whether the current values are within range (✅) or need adjustment (❌).
    Recommended Measures to Improve Yield:
    
    Humidity Management: Methods to increase or decrease humidity based on crop needs.
    Soil Moisture Improvement: Suggest irrigation techniques, mulching, or soil amendments.
    Nutrient Adjustment: Provide organic and inorganic fertilizers to optimize NPK levels.
    Soil pH Correction: Suggest amendments like lime (to increase pH) or sulfur (to decrease pH).
    Advanced Farming Techniques: Recommend precision farming, intercropping, or disease prevention methods.
    Example Input:
    yaml
    Copy
    Edit
    Crop: Rice  
    Temperature (°C): 30  
    Humidity (%): 45  
    Soil Moisture: 53  
    N: 70  
    P: 40  
    K: 17  
    pH: 5.77  
    Expected Output:
    Current Conditions for Mango:
    Temperature: 30°C (✅ Ideal)
    Humidity: 45% (❌ Slightly Low)
    Soil Moisture: 53% (❌ Needs Increase)
    N (Nitrogen): 70 (❌ Slightly Low)
    P (Phosphorus): 40 (✅ Good)
    K (Potassium): 17 (❌ Too Low)
    pH: 5.77 (❌ Slightly Acidic)
    Recommended Measures:
    Increase Humidity: Use misting systems, windbreaks, and organic mulching.
    Improve Soil Moisture: Apply deep irrigation and mulching with dry leaves/straw.
    Optimize Nutrients: Add compost, farmyard manure (FYM), and potassium-rich fertilizers.
    Adjust Soil pH: Apply lime (calcium carbonate) to increase pH slightly.
    Adopt Advanced Techniques: Use drip irrigation, grafting for better fruiting, and organic pesticides for disease control.
    By implementing these changes, the farmer can significantly improve crop yield.
    Maximum 200 words strictly
    give pointers only if necessary.
    `;