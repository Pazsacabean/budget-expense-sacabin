// In src/lib/gemini.js - UPDATE the API key handling:

if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('AIzaSyBk2')) {
  console.warn('⚠️ Using a potentially restricted API key. Replace with your own from Google AI Studio.');
}

async function getAvailableModel() {
  console.log('🔍 Testing Gemini models...');
  
  const testModels = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-1.0-pro'
  ];
  
  for (const modelName of testModels) {
    try {
      console.log(`Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Quick test with simple prompt
      const testResult = await model.generateContent("Test");
      console.log(`✅ Model ${modelName} is available`);
      return model;
    } catch (error) {
      console.warn(`❌ Model ${modelName} failed:`, error.message);
      continue;
    }
  }
  
  throw new Error('❌ No working Gemini models found. Check API key and billing.');
}


export const getBudgetSuggestions = async (amount, period = 'weekly') => {
  try {
    const model = await getAvailableModel();

    const prompt = `As a financial advisor, suggest a budget breakdown for ${period} budget of ₱${amount}. 
    Provide specific allocations for Food, Transportation, and Other expenses.
    Format response strictly as a single JSON object: { "food": amount, "transportation": amount, "other": amount, "tips": "string" }`;

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json"
        }
    });
    
    const text = result.response.text();
    return JSON.parse(text);

  } catch (error) {
    console.error('Gemini API error in getBudgetSuggestions:', error);

    return {
      food: amount * 0.4,
      transportation: amount * 0.3,
      other: amount * 0.3,
      tips: "AI is unavailable. Using default 40-30-30 budget allocation."
    };
  }
};


export const chatWithGemini = async (message, chatHistory = '', userRole = 'user') => {
  try {
    const model = await getAvailableModel();
    
    let systemPrompt = "You are a helpful budgeting assistant. ";
    switch (userRole) {
      case 'admin':
        systemPrompt += "You have administrative privileges. Provide system insights and financial analytics.";
        break;
      case 'user':
        systemPrompt += "Provide personalized budgeting advice and expense tracking tips.";
        break;
      default:
        systemPrompt += "Provide general financial advice and budgeting tips.";
    }
    
    const fullPrompt = `${systemPrompt}\n\nChat history:\n${chatHistory}\n\nUser: ${message}\nAssistant:`;
    
    const result = await model.generateContent(fullPrompt);
    
    const responseText = result.response.text(); 
    return responseText.trim();
    
  } catch (error) {
    console.error('Chat error:', error);
    console.error('Error details:', {
      message: error.message,
      errorMessage: error.error?.message 
    });
    return "I'm having trouble responding. Please try again.";
  }
};



export async function debugAvailableModels() {
  console.log('--- Starting Model Debug ---');
  

  try {
    const responseV1 = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`
    );
    const dataV1 = await responseV1.json();
    console.log('✅ Available models (v1):');
    if (dataV1.models) {
      dataV1.models.forEach(m => console.log(`  - ${m.name}`));
    } else {
      console.log(dataV1);
    }
  } catch (error) {
    console.error('❌ Debug error for v1:', error);
  }
  

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );
    const data = await response.json();
    console.log('✅ Available models (v1beta):');
    if (data.models) {
      data.models.forEach(m => console.log(`  - ${m.name}`));
    } else {
      console.log(data);
    }
  } catch (error) {
    console.error('❌ Debug error for v1beta:', error);
  }
  
  console.log('--- Model Debug Complete ---');
  console.log('💡 To use this debug function, run: import { debugAvailableModels } from "./lib/gemini"; debugAvailableModels();');
}