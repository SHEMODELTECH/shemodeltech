// src/services/googleFormService.js

const googleFormService = {
  /**
   * Submit user data to Google Form
   * @param {Object} userData - Object containing user's full name and email
   * @returns {Promise} - Promise resolving to submission status
   */
  submitToGoogleForm: async (userData) => {
    try {
      // Google Form submission URL - replace with your actual form URL
      const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScgJFqxHTOlfB7qfG-5954B-qMsY3j6TOngfSm7ZaLToZ1_Yg/formResponse';
      
      // Create form data
      const formData = new FormData();
      
      // Add form fields - these entry.X values are from your Google Form
      formData.append('entry.2120631500', userData.fullName);
      formData.append('entry.289230066', userData.email);
      
      // Submit the form using no-cors to avoid CORS issues
      // Note: This means you won't get a success/error response directly
      const response = await fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });
      
      // Since we're using no-cors, we won't get a readable response
      // We'll assume success if no error is thrown
      return { success: true };
    } catch (error) {
      console.error('Error submitting to Google Form:', error);
      return { success: false, error };
    }
  }
};

export default googleFormService;
