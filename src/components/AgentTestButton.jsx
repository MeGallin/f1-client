/**
 * Test Component for F1 Agent Integration
 * Simple button to test the agent API connection
 */

import React, { useState } from 'react';
import f1AgentApi from '../services/agentApi';

const AgentTestButton = () => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const testAgentConnection = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      // Test agent status
      const statusResult = await f1AgentApi.getAgentStatus();
      
      // Test a simple query
      const queryResult = await f1AgentApi.queryMultiAgent('What is Formula 1?');

      setTestResult({
        status: statusResult,
        query: queryResult,
        timestamp: new Date(),
      });
    } catch (error) {
      setTestResult({
        error: error.message,
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card mt-3" style={{ maxWidth: '500px' }}>
      <div className="card-header">
        <h6 className="mb-0">🧪 AI Agent Connection Test</h6>
      </div>
      <div className="card-body">
        <button 
          className="btn btn-primary btn-sm"
          onClick={testAgentConnection}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner-border spinner-border-sm me-2"></div>
              Testing...
            </>
          ) : (
            'Test Agent Connection'
          )}
        </button>

        {testResult && (
          <div className="mt-3">
            <h6>Test Results:</h6>
            <pre className="bg-light p-2 rounded small">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentTestButton;