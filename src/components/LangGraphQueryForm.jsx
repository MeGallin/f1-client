import React, { useState, useEffect } from 'react';
import f1MCPClient from '../services/api.js';

function LangGraphQueryForm({ onResults }) {
  const [query, setQuery] = useState('');
  const [queryMode, setQueryMode] = useState('smart'); // 'smart', 'agents', 'mcp'
  const [selectedAgent, setSelectedAgent] = useState('multiAgent'); // Updated default
  const [loading, setLoading] = useState(false);
  const [availableAgents, setAvailableAgents] = useState(null);

  useEffect(() => {
    loadAvailableAgents();
  }, []);
  const loadAvailableAgents = async () => {
    try {
      console.log('Loading available LangGraph agents...');
      const agents = await f1MCPClient.getAvailableAgents();
      setAvailableAgents(agents);
      console.log('Available agents loaded:', agents);
    } catch (error) {
      console.warn(
        'Could not load LangGraph agents (service not deployed):',
        error.message,
      ); // Set fallback agents data - Updated to match service response
      setAvailableAgents({
        available: ['multiAgent', 'seasonAnalysis'], // Updated names
        details: {
          multiAgent: {
            // Updated key
            status: 'service_not_deployed',
            description: 'Service will be available after deployment',
          },
          seasonAnalysis: {
            // Updated key
            status: 'service_not_deployed',
            description: 'Service will be available after deployment',
          },
        },
        systemStatus: 'service_not_deployed',
        message:
          'LangGraph service is not yet deployed. Use MCP Tools tab for direct F1 data access.',
      });
    }
  };
  // LangGraph Agent options - Updated to match actual service response
  const agentOptions = [
    {
      id: 'multiAgent', // Changed from 'multi-agent' to match service
      name: '🤖 Multi-Agent Orchestrator',
      description: 'Intelligent routing to best agent for your query',
      endpoint: '/agents/analyze',
    },
    {
      id: 'seasonAnalysis', // Changed from 'season-analysis' to match service
      name: '🏎️ Season Analysis Agent',
      description: 'Deep season statistics and championship analysis',
      endpoint: '/agents/season/analyze',
    },
    {
      id: 'driver-performance',
      name: '👨‍🏎️ Driver Performance Agent',
      description: 'Driver career analysis and comparisons',
      endpoint: '/agents/driver/analyze',
    },
    {
      id: 'race-strategy',
      name: '🏁 Race Strategy Agent',
      description: 'Race weekend analysis and strategy insights',
      endpoint: '/agents/race/analyze',
    },
    {
      id: 'championship-predictor',
      name: '🏆 Championship Predictor',
      description: 'Predictive analysis for championship outcomes',
      endpoint: '/agents/championship/analyze',
    },
    {
      id: 'historical-comparison',
      name: '📊 Historical Comparison Agent',
      description: 'Cross-era analysis and historical insights',
      endpoint: '/agents/historical/analyze',
    },
  ];

  // Sample queries for different modes
  const sampleQueries = {
    smart: [
      'Who will win the 2025 F1 championship?',
      'Compare Max Verstappen and Lewis Hamilton career statistics',
      'Analyze the 2023 F1 season performance trends',
      'What are the strategic considerations for the Monaco Grand Prix?',
      'How has Red Bull Racing performed compared to Ferrari in recent years?',
    ],
    agents: [
      'Provide a comprehensive analysis of the 2024 constructor championship battle',
      'Predict championship scenarios for the remaining 2025 races',
      'Compare driver performance across different circuit types',
      'Analyze the evolution of F1 technology from 2000 to 2025',
      'What factors contributed to Mercedes dominance in the hybrid era?',
    ],
    mcp: [
      'Get current F1 season information',
      'Show driver standings for 2025',
      'List all races in the 2024 season',
      'Get constructor championship standings',
      'Show details for the next F1 race',
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);

    try {
      let result;
      let methodUsed;

      switch (queryMode) {
        case 'smart':
          result = await f1MCPClient.smartQuery(query);
          methodUsed = 'Smart Query (Auto-routing)';
          break;
        case 'agents':
          if (selectedAgent === 'multiAgent') {
            // Updated name
            result = await f1MCPClient.analyzeWithAgents(query);
            methodUsed = 'Multi-Agent Orchestrator';
          } else if (selectedAgent === 'seasonAnalysis') {
            // Updated name
            result = await f1MCPClient.analyzeSeasonWithAgent(query);
            methodUsed = 'Season Analysis Agent';
          } else {
            // For other agents, use the multi-agent orchestrator with options
            result = await f1MCPClient.analyzeWithAgents(query, {
              preferredAgent: selectedAgent,
            });
            methodUsed = `${
              agentOptions.find((a) => a.id === selectedAgent)?.name ||
              selectedAgent
            }`;
          }
          break;

        case 'mcp':
          result = await f1MCPClient.fallbackToMCPTools(query);
          methodUsed = 'Direct MCP Tools';
          break;

        default:
          throw new Error('Invalid query mode');
      }

      const queryResult = {
        query: query,
        mode: queryMode,
        method: methodUsed,
        agent: selectedAgent,
        data: result,
        timestamp: new Date().toISOString(),
        success: true,
      };

      onResults(queryResult);
    } catch (error) {
      console.error(`❌ Query execution failed:`, error);

      const errorResult = {
        query: query,
        mode: queryMode,
        method: queryMode,
        error: error.message,
        timestamp: new Date().toISOString(),
        success: false,
      };

      onResults(errorResult);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleQuery = (sampleQuery) => {
    setQuery(sampleQuery);
  };

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">🤖 F1 LangGraph Query Interface</h5>
        <small>Intelligent F1 analysis powered by LangGraph agents</small>{' '}
      </div>
      {/* Service Status Indicator */}
      {availableAgents &&
        availableAgents.systemStatus === 'live_production' && (
          <div className="alert alert-success mb-3" role="alert">
            <div className="d-flex align-items-center">
              <span className="me-2">🚀</span>
              <div>
                <strong>LangGraph Service Status:</strong> Live and operational!
                <br />
                <small>
                  All intelligent F1 analysis agents are available and ready to
                  process your queries.
                </small>
              </div>
            </div>
          </div>
        )}

      {availableAgents &&
        availableAgents.systemStatus === 'service_temporarily_unavailable' && (
          <div className="alert alert-warning mb-3" role="alert">
            <div className="d-flex align-items-center">
              <span className="me-2">⚠️</span>
              <div>
                <strong>LangGraph Service Status:</strong> Temporarily
                unavailable
                <br />
                <small>
                  Service may be starting up or temporarily down. Using direct
                  API fallback.
                </small>
              </div>
            </div>
          </div>
        )}

      <div className="card-body">
        {/* Query Mode Selection */}
        <div className="mb-3">
          <label className="form-label fw-bold">Query Mode</label>
          <div className="btn-group w-100" role="group">
            <input
              type="radio"
              className="btn-check"
              name="queryMode"
              id="smart"
              value="smart"
              checked={queryMode === 'smart'}
              onChange={(e) => setQueryMode(e.target.value)}
            />{' '}
            <label className="btn btn-outline-success" htmlFor="smart">
              🧠 Smart Query
              {availableAgents?.systemStatus === 'live_production' && (
                <small className="d-block">Auto-routing</small>
              )}
              {availableAgents?.systemStatus ===
                'service_temporarily_unavailable' && (
                <small className="d-block">Direct API Mode</small>
              )}
            </label>
            <input
              type="radio"
              className="btn-check"
              name="queryMode"
              id="agents"
              value="agents"
              checked={queryMode === 'agents'}
              onChange={(e) => setQueryMode(e.target.value)}
              disabled={
                availableAgents?.systemStatus ===
                'service_temporarily_unavailable'
              }
            />
            <label
              className={`btn ${
                availableAgents?.systemStatus ===
                'service_temporarily_unavailable'
                  ? 'btn-outline-secondary disabled'
                  : 'btn-outline-primary'
              }`}
              htmlFor="agents"
            >
              🤖 LangGraph Agents
              {availableAgents?.systemStatus === 'live_production' && (
                <small className="d-block text-success">✅ Live</small>
              )}
              {availableAgents?.systemStatus ===
                'service_temporarily_unavailable' && (
                <small className="d-block">Temporarily Down</small>
              )}
            </label>
            <input
              type="radio"
              className="btn-check"
              name="queryMode"
              id="mcp"
              value="mcp"
              checked={queryMode === 'mcp'}
              onChange={(e) => setQueryMode(e.target.value)}
            />
            <label className="btn btn-outline-secondary" htmlFor="mcp">
              🔧 Direct MCP
            </label>
          </div>
        </div>

        {/* Agent Selection (only for agents mode) */}
        {queryMode === 'agents' && (
          <div className="mb-3">
            <label htmlFor="agentSelect" className="form-label fw-bold">
              Select Agent
            </label>
            <select
              id="agentSelect"
              className="form-select"
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
            >
              {agentOptions.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} - {agent.description}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Query Input */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="query" className="form-label fw-bold">
              Your F1 Query <span className="text-danger">*</span>
            </label>
            <textarea
              id="query"
              className="form-control"
              rows="3"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                queryMode === 'smart'
                  ? "Ask anything about F1 - I'll route it to the best agent or tool..."
                  : queryMode === 'agents'
                  ? 'Ask complex F1 questions that require intelligent analysis...'
                  : "Simple F1 data queries like 'current season' or 'driver standings'..."
              }
              required
            />
          </div>

          {/* Sample Queries */}
          <div className="mb-3">
            <label className="form-label fw-bold">Sample Queries</label>
            <div className="d-flex flex-wrap gap-1">
              {sampleQueries[queryMode].slice(0, 3).map((sample, index) => (
                <button
                  key={index}
                  type="button"
                  className="btn btn-outline-info btn-sm"
                  onClick={() => handleSampleQuery(sample)}
                >
                  {sample.length > 50
                    ? sample.substring(0, 47) + '...'
                    : sample}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Description */}
          <div className="alert alert-light mb-3">
            {queryMode === 'smart' && (
              <div>
                <strong>🧠 Smart Query Mode:</strong> AI automatically routes
                your question to the most appropriate agent or MCP tool.
              </div>
            )}
            {queryMode === 'agents' && (
              <div>
                <strong>🤖 LangGraph Agents Mode:</strong> Use advanced AI
                agents for complex analysis and multi-step reasoning.
              </div>
            )}
            {queryMode === 'mcp' && (
              <div>
                <strong>🔧 Direct MCP Mode:</strong> Direct access to F1 data
                through Model Context Protocol tools.
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                {queryMode === 'smart' && 'Analyzing with AI...'}
                {queryMode === 'agents' && 'Running LangGraph Agent...'}
                {queryMode === 'mcp' && 'Fetching F1 Data...'}
              </>
            ) : (
              <>
                {queryMode === 'smart' && '🧠 Smart Analyze'}
                {queryMode === 'agents' && '🤖 Run Agent'}
                {queryMode === 'mcp' && '🔧 Get Data'}
              </>
            )}
          </button>
        </form>

        {/* System Status */}
        <div className="mt-3 text-center">
          <small className="text-muted">
            Integration: UI → LangGraph Agents → MCP Server → API Proxy → F1
            Data
            {availableAgents && (
              <span className="ms-2 badge bg-success">
                {Object.keys(availableAgents.details || {}).length} agents
                available
              </span>
            )}
          </small>
        </div>
      </div>
    </div>
  );
}

export default LangGraphQueryForm;
