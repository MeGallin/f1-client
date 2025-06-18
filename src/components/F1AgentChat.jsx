/**
 * F1 AI Agent Chat Component
 * 
 * Interactive chat interface for F1 LangGraph Agents
 * Provides AI-powered F1 analysis through a clean modal interface
 */

import React, { useState, useEffect, useRef } from 'react';
import f1AgentApi from '../services/agentApi';

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
        f1AgentApi.getAgentStatus()
      ]);
      
      if (agentsResult.success) {
        setAvailableAgents(agentsResult.data);
      } else {
        setAvailableAgents(agentsResult.data); // Fallback data
      }
      
      setAgentStatus(statusResult.success ? statusResult.data : statusResult.data);
    };

    if (isOpen) {
      loadAgentData();
    }
  }, [isOpen]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
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
        agentId: 'system'
      }]);
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

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const result = await f1AgentApi.queryAgent(selectedAgent, userMessage.content);
      
      if (result.success) {
        const agentMessage = {
          id: Date.now() + 1,
          type: 'agent',
          content: result.data.response || result.data.analysis || 'Analysis completed successfully.',
          timestamp: new Date(),
          agentId: result.data.agentUsed || selectedAgent,
          processingTime: result.data.processingTime,
        };
        setMessages(prev => [...prev, agentMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          type: 'error',
          content: `⚠️ ${result.error.message || 'Unable to process your request. Please try again.'}`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: '🚨 An unexpected error occurred. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
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
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content" style={{ height: '90vh', background: 'var(--f1-white)', border: '2px solid var(--f1-red-primary)' }}>
          {/* Modal Header */}
          <div className="modal-header" style={{ background: 'var(--f1-gradient-dark)', color: 'var(--f1-white)', borderBottom: '2px solid var(--f1-red-primary)' }}>
            <h5 className="modal-title d-flex align-items-center" style={{ fontFamily: 'var(--font-racing)', fontWeight: 'var(--fw-black)' }}>
              <i className="fas fa-robot me-2" style={{ color: 'var(--f1-red-primary)' }}></i>
              F1 AI Agent Assistant
              {agentStatus && (
                <span className={`badge ms-2 ${agentStatus.status === 'healthy' ? 'bg-success' : 'bg-warning'}`}>
                  {agentStatus.status || 'Unknown'}
                </span>
              )}
            </h5>
            <div className="d-flex align-items-center">
              {/* Agent Selector */}
              <select 
                className="form-select form-select-sm me-3" 
                value={selectedAgent} 
                onChange={(e) => setSelectedAgent(e.target.value)}
                style={{ width: '200px', background: 'var(--f1-white)', border: '1px solid var(--f1-grey-300)' }}
              >
                {availableAgents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.icon} {agent.name}
                  </option>
                ))}
              </select>
              <button 
                type="button" 
                className="btn btn-outline-light btn-sm me-2"
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

          {/* Modal Body - Chat Messages */}
          <div className="modal-body p-0" style={{ display: 'flex', flexDirection: 'column', height: 'calc(90vh - 140px)' }}>
            <div className="chat-messages flex-grow-1 p-3" style={{ overflowY: 'auto', background: 'var(--f1-grey-50)' }}>
              {messages.map((message) => (
                <div key={message.id} className={`d-flex mb-3 ${message.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div 
                    className={`card border-0 shadow-sm ${message.type === 'user' ? 'bg-primary text-white' : message.type === 'error' ? 'bg-danger text-white' : 'bg-white'}`}
                    style={{ 
                      maxWidth: '75%',
                      background: message.type === 'user' ? 'var(--f1-red-primary)' : message.type === 'error' ? 'var(--f1-red-dark)' : 'var(--f1-white)',
                      border: message.type !== 'user' && message.type !== 'error' ? '1px solid var(--f1-grey-200)' : 'none'
                    }}
                  >
                    <div className="card-body p-3">
                      {message.type === 'agent' && (
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-robot me-2" style={{ color: 'var(--f1-red-primary)' }}></i>
                          <small className="text-muted" style={{ fontFamily: 'var(--font-primary)', fontWeight: 'var(--fw-medium)' }}>
                            F1 AI Agent {message.agentId && `(${message.agentId})`}
                          </small>
                          {message.processingTime && (
                            <small className="text-muted ms-2">• {message.processingTime}s</small>
                          )}
                        </div>
                      )}
                      <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-primary)', lineHeight: '1.5' }}>
                        {message.content}
                      </div>
                      <small className="text-muted mt-2 d-block" style={{ fontSize: '0.75rem' }}>
                        {message.timestamp.toLocaleTimeString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="d-flex justify-content-start mb-3">
                  <div className="card bg-white border-0 shadow-sm" style={{ maxWidth: '75%' }}>
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <div className="spinner-border spinner-border-sm me-2" style={{ color: 'var(--f1-red-primary)' }}></div>
                        <span style={{ fontFamily: 'var(--font-primary)', color: 'var(--f1-grey-600)' }}>
                          AI is analyzing your request...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Example Queries */}
            {messages.length <= 1 && (
              <div className="px-3 py-2" style={{ background: 'var(--f1-white)', borderTop: '1px solid var(--f1-grey-200)' }}>
                <small className="text-muted mb-2 d-block" style={{ fontFamily: 'var(--font-primary)', fontWeight: 'var(--fw-medium)' }}>
                  💡 Try these example queries:
                </small>
                <div className="d-flex flex-wrap gap-2">
                  {f1AgentApi.getExampleQueries().slice(0, 3).map((query, index) => (
                    <button
                      key={index}
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => insertExampleQuery(query)}
                      style={{ fontSize: '0.75rem', fontFamily: 'var(--font-primary)' }}
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-3" style={{ background: 'var(--f1-white)', borderTop: '2px solid var(--f1-grey-200)' }}>
              <div className="input-group">
                <textarea
                  ref={inputRef}
                  className="form-control"
                  placeholder="Ask me anything about Formula 1..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={2}
                  disabled={isLoading}
                  style={{ 
                    resize: 'none', 
                    fontFamily: 'var(--font-primary)',
                    border: '1px solid var(--f1-grey-300)',
                    borderRadius: 'var(--border-radius)'
                  }}
                />
                <button 
                  className="btn btn-primary" 
                  type="button" 
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputText.trim()}
                  style={{ 
                    background: 'var(--f1-red-primary)', 
                    borderColor: 'var(--f1-red-primary)',
                    fontFamily: 'var(--font-primary)',
                    fontWeight: 'var(--fw-semibold)'
                  }}
                >
                  {isLoading ? (
                    <div className="spinner-border spinner-border-sm" role="status">
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