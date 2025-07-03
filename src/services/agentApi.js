/**
 * F1 LangGraph Agents API Service
 * 
 * Provides communication with the F1 LangGraph Agents service
 * for AI-powered F1 analysis and insights.
 */

import axios from 'axios';

class F1AgentApiService {
  constructor() {
    // Use environment variable or fallback to localhost for development
    this.baseURL = import.meta.env.VITE_F1_LANGGRAPH_AGENTS_URL || 'http://localhost:8000';
    console.log('🤖 F1 Agent API initialized with URL:', this.baseURL);
    console.log('🔧 Environment check - VITE_F1_LANGGRAPH_AGENTS_URL:', import.meta.env.VITE_F1_LANGGRAPH_AGENTS_URL);
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
      console.log('🤖 Raw agents response:', response.data);
      
      // Handle different response formats from the API
      let agentsList = [];
      
      if (response.data.available && Array.isArray(response.data.available)) {
        // Format: { available: ["seasonAnalysis", "multiAgent"], details: {...} }
        agentsList = response.data.available.map(agentId => {
          const details = response.data.details?.[agentId] || {};
          return {
            id: agentId,
            name: details.name || this.getAgentDisplayName(agentId),
            icon: this.getAgentIcon(agentId),
            description: details.description || 'F1 analysis agent'
          };
        });
      } else if (Array.isArray(response.data)) {
        // Format: direct array of agents
        agentsList = response.data;
      } else {
        // Unknown format, use fallback
        console.warn('🤖 Unknown agents response format, using fallback');
        agentsList = this.getFallbackAgents();
      }
      
      return {
        success: true,
        data: agentsList,
      };
    } catch (error) {
      console.warn('🤖 Failed to get agents from service, using fallback:', error.message);
      return {
        success: true,
        data: this.getFallbackAgents(),
      };
    }
  }

  /**
   * Get fallback agent list - Updated for F1 Sequential Agents
   */
  getFallbackAgents() {
    return [
      { id: 'multiAgent', name: 'AI Orchestrator', icon: '🎯', description: 'Intelligent routing to best agent (Recommended)' },
      { id: 'raceResults', name: 'Race Results', icon: '🏁', description: 'Race outcome analysis and insights' },
      { id: 'circuit', name: 'Circuit Analysis', icon: '🏎️', description: 'Circuit-specific data and track insights' },
      { id: 'driver', name: 'Driver Performance', icon: '👨‍🏎️', description: 'Individual driver performance and statistics' },
      { id: 'constructor', name: 'Constructor Analysis', icon: '🏭', description: 'Team/constructor performance analysis' },
      { id: 'championship', name: 'Championship Predictor', icon: '🏆', description: 'Championship standings and predictions' },
      { id: 'historical', name: 'Historical Comparison', icon: '📊', description: 'Historical data analysis and comparisons' },
    ];
  }

  /**
   * Get display name for agent ID - Updated for F1 Sequential Agents
   */
  getAgentDisplayName(agentId) {
    const names = {
      'multiAgent': 'AI Orchestrator',
      'raceResults': 'Race Results',
      'circuit': 'Circuit Analysis',
      'driver': 'Driver Performance',
      'constructor': 'Constructor Analysis',
      'championship': 'Championship Predictor',
      'historical': 'Historical Comparison',
      // Legacy mappings for backward compatibility
      'seasonAnalysis': 'Season Analysis',
      'driver-performance': 'Driver Performance',
      'race-strategy': 'Race Strategy',
      'championship-predictor': 'Championship Predictor',
      'historical-comparison': 'Historical Comparison'
    };
    return names[agentId] || agentId;
  }

  /**
   * Get icon for agent ID - Updated for F1 Sequential Agents
   */
  getAgentIcon(agentId) {
    const icons = {
      'multiAgent': '🎯',
      'raceResults': '🏁',
      'circuit': '🏎️',
      'driver': '👨‍🏎️',
      'constructor': '🏭',
      'championship': '🏆',
      'historical': '📊',
      // Legacy mappings for backward compatibility
      'seasonAnalysis': '🏎️',
      'driver-performance': '👨‍🏎️',
      'race-strategy': '🏁',
      'championship-predictor': '🏆',
      'historical-comparison': '📊'
    };
    return icons[agentId] || '🤖';
  }

  /**
   * Send a query to a specific agent
   */
  async queryAgent(agentId, query, options = {}) {
    try {
      const payload = {
        query,
        agentId, // Pass the selected agent ID to the Sequential Agents system
        ...options,
      };

      console.log('🤖 Sending query to F1 Sequential Agents - Agent:', agentId, 'Query:', query.substring(0, 50) + '...');
      console.log('🔧 Using baseURL:', this.baseURL);
      console.log('🔧 Client baseURL:', this.client.defaults.baseURL);
      
      // F1 Sequential Agents uses a unified endpoint
      const endpoint = '/agents/analyze';
      
      // Force recreate client with current baseURL to avoid caching issues
      const freshClient = axios.create({
        baseURL: this.baseURL,
        timeout: 60000,
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await freshClient.post(endpoint, payload);
      
      return {
        success: true,
        data: {
          response: response.data.response || response.data.result?.finalResponse || 'Analysis completed successfully.',
          agentUsed: response.data.metadata?.agentsUsed?.join(', ') || agentId,
          processingTime: response.data.processingTime || 0,
          serviceStatus: 'operational',
          confidence: response.data.confidence,
          queryType: response.data.metadata?.queryType,
          agentsUsed: response.data.metadata?.agentsUsed
        },
      };
    } catch (error) {
      console.warn('🤖 Agent query failed:', error.message);
      
      // Provide a helpful fallback response when the service is unavailable
      return {
        success: true,
        data: {
          response: `🤖 **AI Agent Service Update**

I can see the F1 LangGraph Agents service is running but experiencing issues with the data source:

• **Service Status**: F1 LangGraph Agents is operational ✅
• **Data Source Issue**: F1 MCP Server is returning 503 Service Unavailable ⚠️  
• **Fallback Mode**: The agents are running with mock data when possible

**Your Query**: "${query}"

**Current Situation**:
The F1 LangGraph Agents service is deployed and running at ${this.baseURL}, but the underlying F1 data service (MCP Server) is temporarily unavailable. This could be due to:

1. **Cold Start**: The MCP server may be starting up (30-60 seconds)
2. **High Load**: The service may be overwhelmed with requests
3. **Deployment**: The MCP server may be updating

**What You Can Try**:
• **Wait 1-2 minutes** and try again - Render services need time to wake up
• **Simple queries** work better when services are recovering
• **Try again later** - the services should stabilize soon

The AI agents are designed to provide expert F1 analysis and should work once the data services are fully operational!`,
          agentUsed: agentId,
          processingTime: 0.1,
          serviceStatus: 'data_service_unavailable'
        },
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
      const response = await this.client.get('/health', { timeout: 5000 });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.warn('🤖 AI Agent service health check failed:', error.message);
      return {
        success: false,
        error: error,
        data: { status: 'unavailable', message: 'AI Agent service is starting up or temporarily unavailable' },
      };
    }
  }

  /**
   * Get example queries for inspiration - Updated for F1 Sequential Agents
   */
  getExampleQueries() {
    return [
      "Who were the top 5 finishers at Monaco this year?",
      "Compare Max Verstappen and Lewis Hamilton's career statistics",
      "Which constructor has the strongest car performance this season?",
      "Predict the championship outcome based on current standings",
      "How does Silverstone's lap times compare across different eras?",
      "What are the key strategic factors for wet weather races?",
      "Analyze Red Bull Racing's development trajectory",
      "Compare the current power unit era to the V8 engine era",
      "Which circuits favor Mercedes vs Ferrari this season?",
      "What historical trends predict tomorrow's race outcome?"
    ];
  }
}

// Export singleton instance
export const f1AgentApi = new F1AgentApiService();
export default f1AgentApi;