/**
 * F1 AI Agent Chat Component
 *
 * Interactive chat interface for F1 LangGraph Agents
 * Provides AI-powered F1 analysis through a clean modal interface
 */

import React, { useState, useEffect, useRef } from 'react';
import f1AgentApi from '../services/agentApi';
import './F1AgentChat.css'; // Import the new styles

const F1AgentChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('multi-agent');
  const [availableAgents, setAvailableAgents] = useState([]);
  const [agentStatus, setAgentStatus] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  // Load available agents and status on mount
  useEffect(() => {
    const loadAgentData = async () => {
      const [agentsResult, statusResult] = await Promise.all([
        f1AgentApi.getAvailableAgents(),
        f1AgentApi.getAgentStatus(),
      ]);

      if (agentsResult.success) {
        setAvailableAgents(agentsResult.data);
      } else {
        setAvailableAgents(agentsResult.data); // Fallback data
      }

      setAgentStatus(
        statusResult.success ? statusResult.data : statusResult.data,
      );
    };

    if (isOpen) {
      loadAgentData();
    }
  }, [isOpen]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          type: 'agent',
          content: `🏎️ **Welcome to F1 AI Analysis!**

I'm your F1 expert powered by advanced AI agents. I can help you with:

• **Season Analysis** - Multi-season trends and insights
• **Driver Performance** - Career analysis and comparisons  
• **Race Strategy** - Circuit analysis and tactical insights
• **Championship Predictions** - Probability models and scenarios
• **Historical Comparisons** - Cross-era analysis
• **And much more!**

What would you like to know about Formula 1?`,
          timestamp: new Date(),
          agentId: 'system',
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const result = await f1AgentApi.queryAgent(
        selectedAgent,
        userMessage.content,
      );

      if (result.success) {
        const agentMessage = {
          id: Date.now() + 1,
          type: 'agent',
          content:
            result.data.response ||
            result.data.analysis ||
            'Analysis completed successfully.',
          timestamp: new Date(),
          agentId: result.data.agentUsed || selectedAgent,
          processingTime: result.data.processingTime,
        };
        setMessages((prev) => [...prev, agentMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          type: 'error',
          content: `⚠️ ${
            result.error.message ||
            'Unable to process your request. Please try again.'
          }`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: '🚨 An unexpected error occurred. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const insertExampleQuery = (query) => {
    setInputText(query);
    inputRef.current?.focus();
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block f1-agent-chat-modal">
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <div className="d-flex align-items-center">
              <h5 className="modal-title d-flex align-items-center">
                <i className="fas fa-robot me-2"></i>
                F1 AI Agent Assistant
              </h5>
              {agentStatus && (
                <span
                  className={`badge ms-2 ${
                    agentStatus.status === 'healthy'
                      ? 'bg-success'
                      : 'bg-warning'
                  }`}
                >
                  {agentStatus.status || 'Unknown'}
                </span>
              )}
            </div>
            <div className="d-flex align-items-center">
              <select
                className="form-select form-select-sm me-3 agent-selector"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
              >
                {availableAgents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.icon} {agent.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-danger btn-sm me-2"
                onClick={clearChat}
                title="Clear Chat"
              >
                <i className="fas fa-trash"></i>
              </button>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
          </div>

          <div className="modal-body p-0 d-flex flex-column">
            <div className="chat-messages flex-grow-1 p-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`d-flex mb-3 ${
                    message.type === 'user'
                      ? 'justify-content-end'
                      : 'justify-content-start'
                  }`}
                >
                  <div className={`card message-card ${message.type}`}>
                    <div className="card-body p-3">
                      {message.type === 'agent' && (
                        <div className="d-flex align-items-center mb-2">
                          <i
                            className="fas fa-robot me-2"
                            style={{ color: 'var(--f1-red-primary)' }}
                          ></i>
                          <small className="text-muted">
                            F1 AI Agent{' '}
                            {message.agentId && `(${message.agentId})`}
                          </small>
                          {message.processingTime && (
                            <small className="text-muted ms-2">
                              • {message.processingTime}s
                            </small>
                          )}
                        </div>
                      )}
                      <div
                        className="message-content"
                        style={{ whiteSpace: 'pre-wrap' }}
                      >
                        {message.content}
                      </div>
                      <small
                        className="text-muted mt-2 d-block"
                        style={{ fontSize: '0.75rem' }}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="d-flex justify-content-start mb-3">
                  <div className="card message-card agent">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <div
                          className="spinner-border spinner-border-sm me-2"
                          style={{ color: 'var(--f1-red-primary)' }}
                        ></div>
                        <span>AI is analyzing your request...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && (
              <div className="px-3 py-2 example-queries">
                <small className="text-muted mb-2 d-block">
                  💡 Try these example queries:
                </small>
                <div className="d-flex flex-wrap gap-2">
                  {f1AgentApi
                    .getExampleQueries()
                    .slice(0, 3)
                    .map((query, index) => (
                      <button
                        key={index}
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => insertExampleQuery(query)}
                      >
                        {query}
                      </button>
                    ))}
                </div>
              </div>
            )}

            <div className="p-3 chat-input-area">
              <div className="input-group">
                <textarea
                  ref={inputRef}
                  className="form-control chat-input"
                  placeholder="Ask me anything about Formula 1..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={2}
                  disabled={isLoading}
                />
                <button
                  className="btn btn-primary send-button"
                  type="button"
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputText.trim()}
                >
                  {isLoading ? (
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-1"></i>
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default F1AgentChat;
