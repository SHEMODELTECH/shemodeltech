// src/services/enhancedStorageService.js
class EnhancedStorageService {
  constructor() {
    this.keys = {
      USER_ANALYSIS: 'user_career_analysis',
      USER_FORM_DATA: 'user_form_data',
      AI_CONTENT: 'ai_generated_content',
      USER_PREFERENCES: 'user_preferences'
    };
  }

  // Save complete user analysis with metadata
  saveUserAnalysis(userId, analysisData) {
    try {
      const dataToSave = {
        userId,
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString(), // 7 days
        ...analysisData
      };
      
      localStorage.setItem(this.keys.USER_ANALYSIS, JSON.stringify(dataToSave));
      console.log('✅ User analysis saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to save user analysis:', error);
      return false;
    }
  }

  // Load user analysis with validation
  loadUserAnalysis(userId) {
    try {
      const saved = localStorage.getItem(this.keys.USER_ANALYSIS);
      if (!saved) return null;

      const data = JSON.parse(saved);
      
      // Check if data belongs to current user
      if (data.userId !== userId) {
        console.log('🔄 Analysis belongs to different user, clearing...');
        this.clearUserAnalysis();
        return null;
      }

      // Check if data has expired
      if (new Date() > new Date(data.expiresAt)) {
        console.log('⏰ Analysis has expired, clearing...');
        this.clearUserAnalysis();
        return null;
      }

      console.log('✅ User analysis loaded successfully');
      return data;
    } catch (error) {
      console.error('❌ Failed to load user analysis:', error);
      return null;
    }
  }

  // Save form data for easy re-access
  saveFormData(userId, formData) {
    try {
      const dataToSave = {
        userId,
        timestamp: new Date().toISOString(),
        formData
      };
      
      localStorage.setItem(this.keys.USER_FORM_DATA, JSON.stringify(dataToSave));
      return true;
    } catch (error) {
      console.error('❌ Failed to save form data:', error);
      return false;
    }
  }

  // Load form data
  loadFormData(userId) {
    try {
      const saved = localStorage.getItem(this.keys.USER_FORM_DATA);
      if (!saved) return null;

      const data = JSON.parse(saved);
      
      if (data.userId !== userId) {
        this.clearFormData();
        return null;
      }

      return data.formData;
    } catch (error) {
      console.error('❌ Failed to load form data:', error);
      return null;
    }
  }

  // Save AI-generated content with better structure
  saveAIContent(userId, aiContent) {
    try {
      const dataToSave = {
        userId,
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)).toISOString(), // 3 days
        content: aiContent
      };
      
      localStorage.setItem(this.keys.AI_CONTENT, JSON.stringify(dataToSave));
      console.log('✅ AI content saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to save AI content:', error);
      return false;
    }
  }

  // Load AI content
  loadAIContent(userId) {
    try {
      const saved = localStorage.getItem(this.keys.AI_CONTENT);
      if (!saved) return null;

      const data = JSON.parse(saved);
      
      if (data.userId !== userId) {
        this.clearAIContent();
        return null;
      }

      if (new Date() > new Date(data.expiresAt)) {
        console.log('⏰ AI content has expired, clearing...');
        this.clearAIContent();
        return null;
      }

      return data.content;
    } catch (error) {
      console.error('❌ Failed to load AI content:', error);
      return null;
    }
  }

  // Save user preferences
  saveUserPreferences(userId, preferences) {
    try {
      const dataToSave = {
        userId,
        timestamp: new Date().toISOString(),
        preferences
      };
      
      localStorage.setItem(this.keys.USER_PREFERENCES, JSON.stringify(dataToSave));
      return true;
    } catch (error) {
      console.error('❌ Failed to save user preferences:', error);
      return false;
    }
  }

  // Load user preferences
  loadUserPreferences(userId) {
    try {
      const saved = localStorage.getItem(this.keys.USER_PREFERENCES);
      if (!saved) return null;

      const data = JSON.parse(saved);
      
      if (data.userId !== userId) {
        return null;
      }

      return data.preferences;
    } catch (error) {
      console.error('❌ Failed to load user preferences:', error);
      return null;
    }
  }

  // Clear specific data
  clearUserAnalysis() {
    localStorage.removeItem(this.keys.USER_ANALYSIS);
  }

  clearFormData() {
    localStorage.removeItem(this.keys.USER_FORM_DATA);
  }

  clearAIContent() {
    localStorage.removeItem(this.keys.AI_CONTENT);
  }

  clearUserPreferences() {
    localStorage.removeItem(this.keys.USER_PREFERENCES);
  }

  // Clear all user data (for logout)
  clearAllUserData() {
    Object.values(this.keys).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('🧹 All user data cleared');
  }

  // Get storage usage info
  getStorageInfo() {
    const info = {};
    Object.entries(this.keys).forEach(([name, key]) => {
      const data = localStorage.getItem(key);
      info[name] = {
        exists: !!data,
        size: data ? new Blob([data]).size : 0,
        lastModified: data ? JSON.parse(data).timestamp : null
      };
    });
    return info;
  }

  // Check if user has saved data
  hasUserData(userId) {
    const analysis = this.loadUserAnalysis(userId);
    const formData = this.loadFormData(userId);
    const aiContent = this.loadAIContent(userId);
    
    return {
      hasAnalysis: !!analysis,
      hasFormData: !!formData,
      hasAIContent: !!aiContent,
      canSkipTest: !!(analysis && formData)
    };
  }
}

export default new EnhancedStorageService();
