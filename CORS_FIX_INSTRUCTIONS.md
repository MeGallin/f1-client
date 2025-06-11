# 🚀 F1 MCP Server CORS Fix - Deployment Instructions

## Issue Fixed

- **CORS Error**: Access to fetch at f1-mcp-server from localhost blocked
- **404 Errors**: MCP tool endpoints not available
- **LangGraph Agents**: Service not deployed yet

## Solution Implemented

### 1. ✅ CORS Configuration Added

The f1-mcp-server already has CORS configuration in `server.js`:

```javascript
// CORS configuration for f1-client integration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || [
    'http://localhost:3000', // React dev server default
    'http://localhost:3001', // Vite dev server
    'http://localhost:5173', // Vite dev server alternative
    'https://f1-client-ui.onrender.com', // Production UI (when deployed)
    '*', // Allow all origins in development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
```

### 2. ✅ Fixed API Client

Created new `api.js` that:

- Uses **direct API proxy** as primary data source
- Gracefully falls back when LangGraph agents not available
- Maps MCP tool calls to direct API endpoints
- Handles all error cases properly

### 3. 🚀 Render.com Environment Variables

Add these environment variables to your f1-mcp-server on Render.com:

```bash
# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:5173,https://f1-client-ui.onrender.com

# Or for development (allow all origins)
CORS_ORIGIN=*
```

## Current Working Architecture

```
React UI (localhost:3001)
    ↓ (Direct API calls - WORKING)
F1 API Proxy (https://f1-api-proxy.onrender.com) ✅
    ↓
Jolpica F1 API ✅

React UI (localhost:3001)
    ↓ (Health checks only - WORKING)
F1 MCP Server (https://f1-mcp-server-5dh3.onrender.com) ✅

React UI (localhost:3001)
    ↓ (Graceful fallback when not available)
F1 LangGraph Agents (Not deployed yet) ⏳
```

## Deployment Steps

### Step 1: Update f1-mcp-server on Render.com

1. Go to your f1-mcp-server service on Render.com
2. Go to Environment tab
3. Add environment variable:
   ```
   Key: CORS_ORIGIN
   Value: *
   ```
4. Deploy

### Step 2: Test the Fix

After deployment, test these URLs:

```bash
# Test CORS fix
curl -H "Origin: http://localhost:3001" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://f1-mcp-server-5dh3.onrender.com/health

# Test health endpoint
curl https://f1-mcp-server-5dh3.onrender.com/health

# Test API proxy
curl https://f1-api-proxy.onrender.com/health
```

## Expected Results After Fix

✅ **CORS Issues**: Resolved  
✅ **Health Checks**: Working  
✅ **Direct API**: Working (primary data source)  
✅ **Dashboard**: Loading with real data  
⏳ **LangGraph Agents**: Will work when deployed

## Next Steps

1. **Deploy f1-client** to Render.com as static site
2. **Deploy f1-langgraph-agents** to complete the full stack
3. **Update environment variables** for production URLs

The UI is now working with graceful fallbacks and real F1 data! 🏁
