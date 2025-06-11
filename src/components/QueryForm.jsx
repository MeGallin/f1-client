import React, { useState, useEffect } from 'react';
import f1MCPClient from '../services/api.js';

function QueryForm({ onResults }) {
  const [query, setQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState('');
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState('2025');
  const [round, setRound] = useState('1');

  // Available MCP tools from your production system
  const mcpTools = [
    {
      id: 'get_f1_seasons',
      name: 'All F1 Seasons',
      description: 'Get all Formula 1 seasons (1950-2025)',
      category: 'Season',
    },
    {
      id: 'get_current_f1_season',
      name: 'Current Season',
      description: 'Get 2025 season information',
      category: 'Season',
    },
    {
      id: 'get_f1_races',
      name: 'Race Schedule',
      description: 'Get races for a specific season',
      category: 'Race',
      requiresYear: true,
    },
    {
      id: 'get_f1_race_details',
      name: 'Race Details',
      description: 'Get specific race information',
      category: 'Race',
      requiresYear: true,
      requiresRound: true,
    },
    {
      id: 'get_current_f1_race',
      name: 'Current Race',
      description: 'Get current race information',
      category: 'Race',
    },
    {
      id: 'get_next_f1_race',
      name: 'Next Race',
      description: 'Get next race information',
      category: 'Race',
    },
    {
      id: 'get_f1_drivers',
      name: 'Drivers',
      description: 'Get drivers for a specific season',
      category: 'Driver',
      requiresYear: true,
    },
    {
      id: 'get_f1_driver_details',
      name: 'Driver Details',
      description: 'Get specific driver information',
      category: 'Driver',
      requiresYear: true,
      requiresDriver: true,
    },
    {
      id: 'get_f1_constructors',
      name: 'Constructors',
      description: 'Get teams for a specific season',
      category: 'Constructor',
      requiresYear: true,
    },
    {
      id: 'get_f1_constructor_details',
      name: 'Constructor Details',
      description: 'Get specific team information',
      category: 'Constructor',
      requiresYear: true,
      requiresConstructor: true,
    },
    {
      id: 'get_f1_race_results',
      name: 'Race Results',
      description: 'Get race results and positions',
      category: 'Results',
      requiresYear: true,
      requiresRound: true,
    },
    {
      id: 'get_f1_qualifying_results',
      name: 'Qualifying Results',
      description: 'Get qualifying session results',
      category: 'Results',
      requiresYear: true,
      requiresRound: true,
    },
    {
      id: 'get_f1_driver_standings',
      name: 'Driver Standings',
      description: 'Get championship standings',
      category: 'Standings',
      requiresYear: true,
    },
    {
      id: 'get_f1_constructor_standings',
      name: 'Constructor Standings',
      description: 'Get team championship standings',
      category: 'Standings',
      requiresYear: true,
    },
  ];

  // Group tools by category
  const groupedTools = mcpTools.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {});

  const selectedToolInfo = mcpTools.find((tool) => tool.id === selectedTool);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTool) return;

    setLoading(true);

    try {
      let result;
      let parameters = {};

      // Build parameters based on tool requirements
      if (selectedToolInfo?.requiresYear) {
        parameters.year = year;
      }
      if (selectedToolInfo?.requiresRound) {
        parameters.round = round;
      }
      if (selectedToolInfo?.requiresDriver && query) {
        parameters.driverId =
          f1MCPClient.parseQuery(query).driver || query.toLowerCase();
      }
      if (selectedToolInfo?.requiresConstructor && query) {
        parameters.constructorId = query.toLowerCase().replace(/\s+/g, '');
      }

      console.log(`🚀 Executing MCP tool: ${selectedTool}`, parameters);

      // Call the specific MCP tool
      result = await f1MCPClient.callMCPTool(selectedTool, parameters);

      const queryResult = {
        tool: selectedTool,
        toolName: selectedToolInfo.name,
        query:
          query || `${selectedToolInfo.name} (${JSON.stringify(parameters)})`,
        parameters: parameters,
        data: result,
        timestamp: new Date().toISOString(),
        success: true,
      };

      onResults(queryResult);

      // Reset form
      setQuery('');
    } catch (error) {
      console.error(`❌ MCP tool execution failed:`, error);

      const errorResult = {
        tool: selectedTool,
        toolName: selectedToolInfo?.name || selectedTool,
        query: query || selectedTool,
        error: error.message,
        timestamp: new Date().toISOString(),
        success: false,
      };

      onResults(errorResult);
    } finally {
      setLoading(false);
    }
  };

  // Quick tool shortcuts
  const quickTools = [
    { tool: 'get_current_f1_season', label: '🏎️ Current Season' },
    { tool: 'get_next_f1_race', label: '🏁 Next Race' },
    { tool: 'get_f1_driver_standings', label: '🏆 Driver Standings' },
    { tool: 'get_f1_constructor_standings', label: '🏗️ Team Standings' },
  ];

  const handleQuickTool = (toolId) => {
    setSelectedTool(toolId);
  };

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">🔍 F1 MCP Query Interface</h5>
        <small>Execute any of the 14 production MCP tools</small>
      </div>
      <div className="card-body">
        {/* Quick Tools */}
        <div className="mb-3">
          <label className="form-label fw-bold">Quick Tools</label>
          <div className="d-flex flex-wrap gap-2">
            {quickTools.map((quickTool) => (
              <button
                key={quickTool.tool}
                type="button"
                className={`btn btn-sm ${
                  selectedTool === quickTool.tool
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                }`}
                onClick={() => handleQuickTool(quickTool.tool)}
              >
                {quickTool.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tool Selection */}
          <div className="mb-3">
            <label htmlFor="mcpTool" className="form-label fw-bold">
              Select MCP Tool <span className="text-danger">*</span>
            </label>
            <select
              id="mcpTool"
              className="form-select"
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              required
            >
              <option value="">Choose an F1 data tool...</option>
              {Object.entries(groupedTools).map(([category, tools]) => (
                <optgroup key={category} label={`${category} Tools`}>
                  {tools.map((tool) => (
                    <option key={tool.id} value={tool.id}>
                      {tool.name} - {tool.description}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Dynamic Parameters */}
          {selectedToolInfo && (
            <div className="row mb-3">
              {selectedToolInfo.requiresYear && (
                <div className="col-md-6">
                  <label htmlFor="year" className="form-label">
                    Year
                  </label>
                  <select
                    id="year"
                    className="form-select"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    {Array.from({ length: 76 }, (_, i) => 2025 - i).map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedToolInfo.requiresRound && (
                <div className="col-md-6">
                  <label htmlFor="round" className="form-label">
                    Round
                  </label>
                  <select
                    id="round"
                    className="form-select"
                    value={round}
                    onChange={(e) => setRound(e.target.value)}
                  >
                    {Array.from({ length: 24 }, (_, i) => i + 1).map((r) => (
                      <option key={r} value={r}>
                        Round {r}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Additional Query Input */}
          {selectedToolInfo &&
            (selectedToolInfo.requiresDriver ||
              selectedToolInfo.requiresConstructor) && (
              <div className="mb-3">
                <label htmlFor="query" className="form-label">
                  {selectedToolInfo.requiresDriver
                    ? 'Driver ID/Name'
                    : 'Constructor ID/Name'}
                </label>
                <input
                  type="text"
                  id="query"
                  className="form-control"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    selectedToolInfo.requiresDriver
                      ? 'e.g., verstappen, hamilton, leclerc...'
                      : 'e.g., red_bull, mercedes, ferrari...'
                  }
                  required
                />
              </div>
            )}

          {/* Optional Query for other tools */}
          {selectedToolInfo &&
            !selectedToolInfo.requiresDriver &&
            !selectedToolInfo.requiresConstructor && (
              <div className="mb-3">
                <label htmlFor="query" className="form-label">
                  Additional Parameters (optional)
                </label>
                <input
                  type="text"
                  id="query"
                  className="form-control"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Add any additional context or notes..."
                />
              </div>
            )}

          {/* Tool Info */}
          {selectedToolInfo && (
            <div className="alert alert-info mb-3">
              <h6 className="alert-heading">{selectedToolInfo.name}</h6>
              <p className="mb-1">{selectedToolInfo.description}</p>
              <small>
                Category:{' '}
                <span className="badge bg-primary">
                  {selectedToolInfo.category}
                </span>
                {selectedToolInfo.requiresYear && (
                  <span className="badge bg-secondary ms-1">Requires Year</span>
                )}
                {selectedToolInfo.requiresRound && (
                  <span className="badge bg-secondary ms-1">
                    Requires Round
                  </span>
                )}
              </small>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading || !selectedTool}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Executing MCP Tool...
              </>
            ) : (
              '🚀 Execute MCP Tool'
            )}
          </button>
        </form>

        {/* Tool Count Info */}
        <div className="mt-3 text-center">
          <small className="text-muted">
            {mcpTools.length} MCP tools available • All connected to production
            services
          </small>
        </div>
      </div>
    </div>
  );
}

export default QueryForm;
