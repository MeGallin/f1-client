# F1 Client - Tests

This directory contains all test files for the F1 Client React application.

## Test Files

### Integration Tests
- **`state-integration.test.js`** - Jotai state management integration tests
- **`missing-endpoints-implementation.test.js`** - API endpoint implementation tests
- **`missing-endpoints.test.js`** - Missing endpoint detection tests
- **`integration-test-missing-endpoints.js`** - Integration test for missing endpoints

### Manual Tests
- **`manual-endpoints-test.js`** - Manual endpoint testing utilities
- **`test-missing-endpoints.js`** - Manual missing endpoint checks
- **`test-route.js`** - Route testing utilities

### Validation Tests
- **`validate-imports.js`** - Import validation for React components
- **`verify-endpoints.js`** - Endpoint verification utilities

### Configuration
- **`test-env.js`** - Test environment configuration
- **`test-instructions.html`** - Manual testing instructions and guidelines

## Running Tests

### All Tests
```bash
npm test                    # Run Vitest test suite
```

### Manual Testing
```bash
node tests/test-route.js              # Route testing
node tests/manual-endpoints-test.js   # Manual endpoint testing
node tests/validate-imports.js        # Import validation
```

### Verification
```bash
node tests/verify-endpoints.js        # Verify API endpoints
node tests/test-missing-endpoints.js  # Check for missing endpoints
```

## Test Coverage
Tests cover:
- React component rendering and behavior
- Jotai state management and atoms
- API endpoint connectivity and responses
- React Router navigation and routing
- Import validation and dependency checks
- Agent integration and communication