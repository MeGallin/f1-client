/**
 * F1 LangGraph Agents API Service
 * 
 * Provides communication with the F1 LangGraph Agents service
 * for AI-powered F1 analysis and insights.
 */

import axios from 'axios';
import { EXTERNAL_CONFIG } from '../config';

class F1AgentApiService {
  constructor() {
    this.baseURL = EXTERNAL_CONFIG.langgraphAgentsUrl;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 60000, // 60 seconds for AI processing
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🤖 AI Agent Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('🚨 AI Agent Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging and error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ AI Agent Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('🚨 AI Agent Response Error:', error);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Handle API errors and provide user-friendly messages
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.error || 'AI Agent service error',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Request made but no response received
      return {
        message: 'AI Agent service is currently unavailable. Please try again later.',
        status: 503,
        data: null,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'Unknown error occurred',
        status: 500,
        data: null,
      };
    }
  }

  /**
   * Get available agents from the service
   */
  async getAvailableAgents() {
    try {
      const response = await this.client.get('/agents');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        data: [
          // Fallback agent list based on project documentation
          { id: 'season-analysis', name: 'Season Analysis', icon: '🏎️', description: 'Multi-season analysis and trends' },
          { id: 'driver-performance', name: 'Driver Performance', icon: '👨‍🏎️', description: 'Driver analysis and comparisons' },
          { id: 'race-strategy', name: 'Race Strategy', icon: '🏁', description: 'Circuit analysis and strategy' },
          { id: 'championship-predictor', name: 'Championship Predictor', icon: '🏆', description: 'Probability calculations and predictions' },
          { id: 'historical-comparison', name: 'Historical Comparison', icon: '📊', description: 'Cross-era comparisons' },
          { id: 'multi-agent', name: 'AI Orchestrator', icon: '🎯', description: 'Multi-agent coordination' },
        ],
      };
    }
  }

  /**
   * Send a query to a specific agent
   */
  async queryAgent(agentId, query, options = {}) {
    try {
      const payload = {
        query,
        agentId,
        ...options,
      };

      const response = await this.client.post('/analyze', payload);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        data: null,
      };
    }
  }

  /**
   * Send a query to the multi-agent orchestrator (recommended for complex queries)
   */
  async queryMultiAgent(query, options = {}) {
    return this.queryAgent('multi-agent', query, options);
  }

  /**
   * Get agent status/health
   */
  async getAgentStatus() {
    try {
      const response = await this.client.get('/health');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error,
        data: { status: 'unavailable', message: 'AI Agent service is currently unavailable' },
      };
    }
  }

  /**
   * Get example queries for inspiration
   */
  getExampleQueries() {
    return [
      "Who are the top 3 drivers this season and how do they compare?",
      "What are the key strategic factors for the next race?",
      "How does Lewis Hamilton's 2024 performance compare to his championship years?",
      "Predict the championship outcome based on current standings",
      "Which constructor has the best development trajectory this season?",
      "What are the most challenging circuits for overtaking this year?",
      "Compare the current era to the V8 engine era",
      "What weather conditions could affect the next race strategy?",
      "Which driver pairing works best together?",
      "How have regulation changes affected competitive balance?"
    ];
  }
}

// Export singleton instance
export const f1AgentApi = new F1AgentApiService();
export default f1AgentApi;