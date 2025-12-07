// src/lib/gemini.js - REPLACE WITH THIS:

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyBk2nXBWsnWZpE5XTBTuqznmGwPxeR5fjs';

// Initialize the API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// ✅ CORRECT MODEL NAMES (December 2024)
const MODEL_NAMES = [
  'gemini-1.5-flash',       // ✅ Most available and cheap
  'gemini-1.5-pro-001',     // ✅ Correct suffix
  'gemini-1.0-pro'          // ✅ Legacy but works
];

// ✅ Function to find available model
async function getAvailableModel() {
  console.log('🔍 Checking available Gemini models...');
  
  for (const modelName of MODEL_NAMES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Test with minimal request
      const testResult = await model.generateContent('Hello');
      console.log(`✅ Model available: ${modelName}`);
      return model;
    } catch (error) {
      console.warn(`❌ Model ${modelName} unavailable:`, error.message);
      continue;
    }
  }
  
  // Fallback: Use a direct fetch to check what's available
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );
    const data = await response.json();
    console.log('Available models:', data.models?.map(m => m.name) || []);
  } catch (fetchError) {
    console.error('Could not fetch model list:', fetchError);
  }
  
  throw new Error('No working Gemini models found. Check API key and billing.');
}

// ✅ Budget suggestions function
export const getBudgetSuggestions = async (amount, period = 'weekly') => {
  try {
    const model = await getAvailableModel();
    
    const prompt = `As a financial advisor, suggest a budget breakdown for ${period} budget of ₱${amount}. 
    Provide specific allocations for Food, Transportation, and Other expenses.
    Return ONLY a JSON object with this exact format:
    {
      "food": number,
      "transportation": number, 
      "other": number,
      "tips": "string"
    }`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback if JSON parsing fails
    return {
      food: amount * 0.4,
      transportation: amount * 0.3,
      other: amount * 0.3,
      tips: "Allocating 40% to Food, 30% to Transportation, 30% to Others"
    };
    
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Always return a fallback response
    return {
      food: amount * 0.4,
      transportation: amount * 0.3,
      other: amount * 0.3,
      tips: "AI is currently unavailable. Using default budget allocation."
    };
  }
};

// ✅ Chat function
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
    return result.response.text().trim();
    
  } catch (error) {
    console.error('Chat error:', error);
    return "I'm having trouble responding right now. Please try again later or check your API key.";
  }
};

// ✅ Debug function
export async function debugAvailableModels() {
  console.log('--- Gemini API Debug ---');
  console.log('API Key present:', !!GEMINI_API_KEY);
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );
    const data = await response.json();
    console.log('Available models:', data.models?.map(m => m.name) || data);
  } catch (error) {
    console.error('Debug fetch error:', error);
  }
}