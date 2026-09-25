// src/services/firebaseCareerService.js
import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  query, 
  where, 
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
  deleteDoc  // ADD THIS LINE
} from 'firebase/firestore';

class FirebaseCareerService {
  constructor() {
    this.collections = {
      CAREER_ANALYSES: 'career_analyses',
      AI_CAREER_CONTENT: 'ai_career_content'
    };
  }

  /**
   * Save complete career analysis to Firebase
   * @param {string} userId - User's unique ID (from Firebase Auth)
   * @param {Object} formData - Complete form submission data
   * @param {string} analysis - AI-generated analysis text
   */
  async saveCareerAnalysis(userId, formData, analysis) {
    try {
      const analysisData = {
        userId: userId,
        userEmail: formData.email || '',
        userName: formData.fullName || '',
        
        // Form data
        educationLevel: formData.educationLevel || '',
        studyField: formData.studyField || '',
        yearsExperience: formData.yearsExperience || '',
        currentRole: formData.currentRole || '',
        
        // Job experience
        jobResponsibilities: formData.jobResponsibilities || '',
        jobProjects: formData.jobProjects || '',
        jobTechnologies: formData.jobTechnologies || '',
        internships: formData.internships || '',
        publications: formData.publications || '',
        
        // Motivation
        techMotivation: formData.techMotivation || '',
        techPassion: formData.techPassion || '',
        
        // Transition info
        transitionReason: formData.transitionReason || '',
        transferableSkills: formData.transferableSkills || '',
        anticipatedChallenges: formData.anticipatedChallenges || '',
        
        // Tech experience
        techInterests: formData.techInterests || '',
        experienceLevel: formData.experienceLevel || '',
        toolsUsed: formData.toolsUsed || [],
        learningComfort: formData.learningComfort || '',
        workPreference: formData.workPreference || '',
        certifications: formData.certifications || '',
        certificationsDetail: formData.certificationsDetail || '',
        
        // Career goals
        careerPathsInterest: formData.careerPathsInterest || [],
        industryPreference: formData.industryPreference || [],
        leverageDomainExpertise: formData.leverageDomainExpertise || '',
        targetSalary: formData.targetSalary || '',
        
        // Timeline
        timeCommitment: formData.timeCommitment || '',
        transitionTimeline: formData.transitionTimeline || '',
        continueCurrent: formData.continueCurrent || '',
        guidanceNeeded: formData.guidanceNeeded || '',
        futureGoal: formData.futureGoal || '',
        
        // AI Analysis
        analysis: analysis,
        
        // Metadata
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastAccessed: serverTimestamp()
      };

      // Use userId as document ID for easy retrieval
      await setDoc(doc(db, this.collections.CAREER_ANALYSES, userId), analysisData);
      
      console.log('✅ Career analysis saved to Firebase');
      return { success: true, documentId: userId };
    } catch (error) {
      console.error('❌ Error saving career analysis to Firebase:', error);
      throw error;
    }
  }

  /**
   * Load career analysis from Firebase
   * @param {string} userId - User's unique ID
   */
  async loadCareerAnalysis(userId) {
    try {
      const docRef = doc(db, this.collections.CAREER_ANALYSES, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Update last accessed timestamp
        await updateDoc(docRef, {
          lastAccessed: serverTimestamp()
        });
        
        console.log('✅ Career analysis loaded from Firebase');
        return data;
      } else {
        console.log('ℹ️ No career analysis found for user');
        return null;
      }
    } catch (error) {
      console.error('❌ Error loading career analysis from Firebase:', error);
      return null;
    }
  }

  /**
   * Save AI-generated career content (recommendations, roadmap, etc.)
   * @param {string} userId - User's unique ID
   * @param {Object} aiContent - AI-generated content
   */
  async saveAICareerContent(userId, aiContent) {
    try {
      const contentData = {
        userId: userId,
        userEmail: aiContent.userEmail || '',
        
        // AI-generated content
        careerRecommendations: aiContent.careerRecommendations || [],
        personalizedRoadmap: aiContent.personalizedRoadmap || null,
        marketInsights: aiContent.marketInsights || null,
        actionPlan: aiContent.actionPlan || [],
        learningPlan: aiContent.learningPlan || null,
        interviewQuestions: aiContent.interviewQuestions || null,
        networkingStrategy: aiContent.networkingStrategy || [],
        
        // Metadata
        lastGenerated: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, this.collections.AI_CAREER_CONTENT, userId), contentData);
      
      console.log('✅ AI career content saved to Firebase');
      return { success: true, documentId: userId };
    } catch (error) {
      console.error('❌ Error saving AI career content to Firebase:', error);
      throw error;
    }
  }

  /**
   * Load AI career content from Firebase
   * @param {string} userId - User's unique ID
   */
  async loadAICareerContent(userId) {
    try {
      const docRef = doc(db, this.collections.AI_CAREER_CONTENT, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log('✅ AI career content loaded from Firebase');
        return docSnap.data();
      } else {
        console.log('ℹ️ No AI career content found for user');
        return null;
      }
    } catch (error) {
      console.error('❌ Error loading AI career content from Firebase:', error);
      return null;
    }
  }

  /**
   * Update specific AI content (e.g., just recommendations or just roadmap)
   * @param {string} userId - User's unique ID
   * @param {Object} updates - Partial update object
   */
  async updateAICareerContent(userId, updates) {
    try {
      const docRef = doc(db, this.collections.AI_CAREER_CONTENT, userId);
      
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ AI career content updated in Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating AI career content in Firebase:', error);
      throw error;
    }
  }

  /**
   * Check if user has existing career data
   * @param {string} userId - User's unique ID
   */
  async hasCareerData(userId) {
    try {
      const analysisDoc = await getDoc(doc(db, this.collections.CAREER_ANALYSES, userId));
      const aiContentDoc = await getDoc(doc(db, this.collections.AI_CAREER_CONTENT, userId));
      
      return {
        hasAnalysis: analysisDoc.exists(),
        hasAIContent: aiContentDoc.exists(),
        canSkipTest: analysisDoc.exists()
      };
    } catch (error) {
      console.error('❌ Error checking career data:', error);
      return {
        hasAnalysis: false,
        hasAIContent: false,
        canSkipTest: false
      };
    }
  }

  /**
   * Delete all career data for a user
   * @param {string} userId - User's unique ID
   */
  async deleteUserCareerData(userId) {
    try {
      const analysisRef = doc(db, this.collections.CAREER_ANALYSES, userId);
      const aiContentRef = doc(db, this.collections.AI_CAREER_CONTENT, userId);
      
      await Promise.all([
        deleteDoc(analysisRef),
        deleteDoc(aiContentRef)
      ]);
      
      console.log('✅ User career data deleted from Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting user career data:', error);
      throw error;
    }
  }
}

export default new FirebaseCareerService();
