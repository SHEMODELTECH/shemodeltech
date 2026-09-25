// src/services/claudeApiService.js
import { CLAUDE_API_CONFIG, CLAUDE_PROMPTS } from '../config/claudeApiConfig';
import firebaseCareerService from './firebaseCareerService';
import { auth } from '../firebase/config';

class ClaudeApiService {
  async getFormSuggestions() {
    try {
      console.log("Calling Claude API for form suggestions");
      
      const requestBody = {
        model: CLAUDE_API_CONFIG.models.default,
        max_tokens: CLAUDE_API_CONFIG.maxTokens.formSuggestions,
        messages: [
          {
            role: "user",
            content: CLAUDE_PROMPTS.formSuggestions
          }
        ]
      };
      
      const response = await fetch('/api/claude-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Form suggestions received successfully");
      return data.content[0].text;
    } catch (error) {
      console.error('Error getting form suggestions:', error);
      throw error;
    }
  }

  async analyzeCareerPath(formData) {
    try {
      console.log("Calling Claude API for career analysis");
      console.log("Using model:", CLAUDE_API_CONFIG.models.default);
      
      const requestBody = {
        model: CLAUDE_API_CONFIG.models.default,
        max_tokens: CLAUDE_API_CONFIG.maxTokens.careerAnalysis,
        messages: [
          {
            role: "user",
            content: CLAUDE_PROMPTS.careerAnalysis(formData)
          }
        ]
      };
      
      const response = await fetch('/api/claude-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        let errorText;
        try {
          const errorJson = await response.json();
          errorText = JSON.stringify(errorJson);
        } catch {
          errorText = await response.text();
        }
        console.error("API Error Response:", errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      const responseText = data.content[0].text;
      
      console.log("Analysis received:", responseText.length, "characters");
      
      // Save to Firebase
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        await firebaseCareerService.saveCareerAnalysis(
          currentUser.uid,
          formData,
          responseText
        );
        console.log('Analysis saved to Firebase for user:', currentUser.uid);
      } else {
        console.warn('User not logged in - analysis not saved');
      }
      
      return responseText;
    } catch (error) {
      console.error('Error analyzing career path:', error);
      throw error;
    }
  }
}

export default new ClaudeApiService();
