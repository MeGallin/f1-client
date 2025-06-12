# F1 Data Explorer - React Client

A modern React-based web application for exploring Formula 1 data using the F1 MCP (Model Context Protocol) server and LangGraph agents.

## 🏁 Features

- **Live F1 Data**: Current season information, race schedules, driver standings
- **Interactive Dashboard**: Real-time system health monitoring and quick actions
- **Modern UI**: Bootstrap-based responsive design with F1 theme
- **State Management**: Powered by Jotai for efficient state handling
- **Production Ready**: Configured for deployment with environment-specific settings

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Available Scripts

- `npm run dev` - Start development server on port 5173
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests

## 🏗️ Architecture

- **Framework**: React 18 with Vite
- **State Management**: Jotai atoms
- **Styling**: Bootstrap 5 + Custom CSS
- **API Integration**: Direct connection to F1 MCP Server
- **Build Tool**: Vite for fast development and optimized builds

## 🌐 Live Integration

- **F1 MCP Server**: https://f1-mcp-server-5dh3.onrender.com
- **F1 API Proxy**: https://f1-api-proxy.onrender.com

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── F1DataDisplayJotai.jsx  # Main dashboard component
│   ├── FeatureFlag.jsx         # Feature flag component
│   └── LoadingIndicator.jsx    # Loading states
├── config/              # App configuration
├── services/            # API services and hooks
├── state/              # Jotai state management
└── styles/             # CSS styling
```

## 🔧 Configuration

The app uses environment variables for configuration:

- `.env` - Production configuration
- `.env.development` - Development overrides

Key environment variables:
- `VITE_F1_MCP_SERVER_URL` - MCP server endpoint
- `VITE_F1_LANGGRAPH_AGENTS_URL` - LangGraph agents endpoint
- `VITE_F1_DEBUG_MODE` - Enable debug mode

## 🧪 Development

The application is configured for optimal development experience:

- Hot reload with Vite
- Debug logging in development mode
- Feature flags for testing new functionality
- Environment-specific configurations

## 📊 Features Available

- Current season and race information
- Driver and constructor standings
- Real-time system health monitoring
- Interactive query interface
- Data export capabilities (JSON/CSV)

## 🤝 Contributing

This is part of the F1 MCP LangGraph project. See the main project README for contribution guidelines.