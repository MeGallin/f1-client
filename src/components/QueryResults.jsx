import React, { useState } from 'react';

function QueryResults({ results }) {
  const [expandedResults, setExpandedResults] = useState(new Set());
  const [filterCategory, setFilterCategory] = useState('all');

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedResults(newExpanded);
  };

  const exportResults = (result, format = 'json') => {
    const filename = `f1-mcp-${result.tool}-${
      new Date().toISOString().split('T')[0]
    }.${format}`;

    let content;
    let mimeType;

    if (format === 'json') {
      content = JSON.stringify(result, null, 2);
      mimeType = 'application/json';
    } else if (format === 'csv') {
      // Simple CSV export for basic data
      content = convertToCSV(result.data);
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data) => {
    if (!data || !Array.isArray(data)) return 'No data available';

    if (data.length === 0) return 'No records found';

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');

    const csvRows = data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          return `"${String(value || '').replace(/"/g, '""')}"`;
        })
        .join(','),
    );

    return [csvHeaders, ...csvRows].join('\n');
  };
  const formatDataPreview = (data) => {
    if (!data) return 'No data';

    // Handle LangGraph agents response format (successful analysis)
    if (data.success && data.result && data.result.finalResponse) {
      const finalResponse = data.result.finalResponse;
      // Show first 200 characters of the analysis
      const preview =
        finalResponse.length > 200
          ? finalResponse.substring(0, 200) + '...'
          : finalResponse;
      return `🤖 LangGraph Analysis: ${preview}`;
    }

    // Handle fallback comparison responses (when LangGraph fails but fallback succeeds)
    if (
      data.success &&
      data.data &&
      data.data.queryType === 'driver_comparison'
    ) {
      return `🔄 Comparison Request: ${data.data.requestedDrivers.join(
        ' vs ',
      )} - ${data.data.note}`;
    }

    // Handle special comparison responses (direct format)
    if (data.queryType === 'driver_comparison') {
      return `🔄 Comparison Request: ${data.requestedDrivers.join(' vs ')} - ${
        data.note
      }`;
    }

    // Handle F1 API response structure
    if (data.success && data.data && data.data.MRData) {
      return formatF1DataPreview(data.data);
    }

    // Handle F1 API response structure (checking for both success and data)
    if (data.success && data.data) {
      return formatF1DataPreview(data.data);
    }

    // Handle direct F1 data
    if (data.MRData) {
      return formatF1DataPreview(data);
    }

    if (Array.isArray(data)) {
      if (data.length === 0) return 'Empty array';

      // Show array length and first few items
      const preview = data.slice(0, 3).map((item) => {
        if (typeof item === 'object') {
          const keys = Object.keys(item).slice(0, 3);
          return keys.map((key) => `${key}: ${item[key]}`).join(', ');
        }
        return item;
      });

      return `${data.length} items: [${preview.join('; ')}${
        data.length > 3 ? '...' : ''
      }]`;
    }

    if (typeof data === 'object') {
      const keys = Object.keys(data).slice(0, 5);
      return (
        keys.map((key) => `${key}: ${data[key]}`).join(', ') +
        (Object.keys(data).length > 5 ? '...' : '')
      );
    }

    return String(data);
  };

  const formatF1DataPreview = (f1Data) => {
    if (!f1Data || !f1Data.MRData) {
      return 'Invalid F1 data format';
    }

    const mrData = f1Data.MRData;

    // Handle different F1 data types
    if (mrData.StandingsTable) {
      const standings = mrData.StandingsTable;
      if (standings.StandingsLists && standings.StandingsLists[0]) {
        const standingsList = standings.StandingsLists[0];
        if (standingsList.DriverStandings) {
          const driverCount = standingsList.DriverStandings.length;
          const leader = standingsList.DriverStandings[0];
          return `${driverCount} drivers, Leader: ${leader?.Driver?.familyName} (${leader?.points} pts)`;
        }
        if (standingsList.ConstructorStandings) {
          const constructorCount = standingsList.ConstructorStandings.length;
          const leader = standingsList.ConstructorStandings[0];
          return `${constructorCount} constructors, Leader: ${leader?.Constructor?.name} (${leader?.points} pts)`;
        }
      }
    }

    if (mrData.RaceTable && mrData.RaceTable.Races) {
      const races = mrData.RaceTable.Races;
      const raceCount = races.length;
      const nextRace =
        races.find((r) => new Date(r.date) > new Date()) || races[0];
      return `${raceCount} races, Next: ${nextRace?.raceName} (${nextRace?.date})`;
    }

    if (mrData.DriverTable && mrData.DriverTable.Drivers) {
      const drivers = mrData.DriverTable.Drivers;
      const driverCount = drivers.length;
      const sampleDrivers = drivers
        .slice(0, 3)
        .map((d) => d.familyName)
        .join(', ');
      return `${driverCount} drivers: ${sampleDrivers}${
        drivers.length > 3 ? '...' : ''
      }`;
    }

    if (mrData.ConstructorTable && mrData.ConstructorTable.Constructors) {
      const constructors = mrData.ConstructorTable.Constructors;
      const constructorCount = constructors.length;
      const sampleConstructors = constructors
        .slice(0, 3)
        .map((c) => c.name)
        .join(', ');
      return `${constructorCount} constructors: ${sampleConstructors}${
        constructors.length > 3 ? '...' : ''
      }`;
    }

    if (mrData.SeasonTable && mrData.SeasonTable.Seasons) {
      const seasons = mrData.SeasonTable.Seasons;
      const seasonCount = seasons.length;
      const latestSeason = seasons[seasons.length - 1];
      return `${seasonCount} seasons, Latest: ${latestSeason?.season}`;
    }

    // Fallback for unknown F1 data structure
    const total = mrData.total || 'unknown';
    const series = mrData.series || 'F1';
    return `${series.toUpperCase()} data: ${total} records`;
  };

  const getResultCategory = (toolName) => {
    if (toolName?.includes('season')) return 'Season';
    if (toolName?.includes('race')) return 'Race';
    if (toolName?.includes('driver')) return 'Driver';
    if (toolName?.includes('constructor')) return 'Constructor';
    if (toolName?.includes('standing')) return 'Standings';
    if (toolName?.includes('result')) return 'Results';
    return 'Other';
  };

  const filteredResults =
    filterCategory === 'all'
      ? results
      : results.filter(
          (result) => getResultCategory(result.toolName) === filterCategory,
        );

  const categories = [
    'all',
    ...new Set(results.map((result) => getResultCategory(result.toolName))),
  ];

  if (!results || results.length === 0) {
    return (
      <div className="card">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0">📊 Query Results</h5>
        </div>
        <div className="card-body text-center py-5">
          <div className="text-muted">
            <h6>No results yet</h6>
            <p>Execute an MCP tool to see results here</p>
            <small>
              Results will appear in real-time as you query the F1 MCP system
            </small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">📊 Query Results</h5>
          <small>{results.length} total results</small>
        </div>
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ width: 'auto' }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        className="card-body"
        style={{ maxHeight: '600px', overflowY: 'auto' }}
      >
        {filteredResults.map((result, index) => (
          <div key={index} className="mb-3">
            <div
              className={`card ${
                result.success ? 'border-success' : 'border-danger'
              }`}
            >
              <div className="card-header d-flex justify-content-between align-items-center">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className={`badge ${
                        result.success ? 'bg-success' : 'bg-danger'
                      }`}
                    >
                      {result.success ? '✅' : '❌'}
                    </span>
                    <strong>{result.toolName || result.tool}</strong>
                    <span className="badge bg-secondary">
                      {getResultCategory(result.toolName)}
                    </span>
                  </div>
                  <small className="text-muted">
                    {new Date(result.timestamp).toLocaleString()}
                  </small>
                </div>

                <div className="d-flex gap-1">
                  {result.success && (
                    <>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => exportResults(result, 'json')}
                        title="Export as JSON"
                      >
                        📄 JSON
                      </button>
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => exportResults(result, 'csv')}
                        title="Export as CSV"
                      >
                        📊 CSV
                      </button>
                    </>
                  )}
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => toggleExpanded(index)}
                  >
                    {expandedResults.has(index) ? '🔼' : '🔽'}
                  </button>
                </div>
              </div>

              <div className="card-body">
                {/* Query Info */}
                <div className="mb-2">
                  <strong>Query:</strong> {result.query}
                  {result.parameters &&
                    Object.keys(result.parameters).length > 0 && (
                      <div className="mt-1">
                        <small className="text-muted">
                          Parameters: {JSON.stringify(result.parameters)}
                        </small>
                      </div>
                    )}
                </div>

                {/* Result or Error */}
                {result.success ? (
                  <div>
                    <div className="mb-2">
                      <strong>Preview:</strong>
                      <div className="bg-light p-2 rounded">
                        <small>{formatDataPreview(result.data)}</small>
                      </div>
                    </div>

                    {expandedResults.has(index) && (
                      <div>
                        <strong>Full Data:</strong>
                        <pre
                          className="bg-dark text-light p-3 rounded mt-2"
                          style={{
                            fontSize: '0.8rem',
                            maxHeight: '400px',
                            overflow: 'auto',
                          }}
                        >
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="alert alert-danger mb-0">
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-footer text-center">
        <small className="text-muted">
          Showing {filteredResults.length} of {results.length} results
          {results.length >= 10 && ' • Older results automatically removed'}
        </small>
      </div>
    </div>
  );
}

export default QueryResults;
