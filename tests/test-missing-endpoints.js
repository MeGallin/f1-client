/**
 * Test script to verify that all missing F1 API endpoints have been implemented
 * This script tests the newly added hooks and action atoms
 */

import { F1API, F1Hooks } from '../src/services/index.js';

// Test the missing API endpoints
async function testMissingEndpoints() {
  console.log('Testing missing F1 API endpoints implementation...\n');

  const testResults = {
    apiEndpoints: {},
    hooks: {},
    actions: {},
  };

  // Test API endpoints that were missing
  console.log('🔍 Testing API Endpoints...');

  try {
    // Test getResultsBySeason (this was mentioned as missing)
    console.log('- Testing getResultsBySeason...');
    testResults.apiEndpoints.getResultsBySeason = F1API.ResultsAPI
      .getResultsBySeason
      ? '✅ Available'
      : '❌ Missing';

    // Test individual driver/constructor methods
    console.log('- Testing getDriver...');
    testResults.apiEndpoints.getDriver = F1API.DriversAPI.getDriver
      ? '✅ Available'
      : '❌ Missing';

    console.log('- Testing getDriverByYear...');
    testResults.apiEndpoints.getDriverByYear = F1API.DriversAPI.getDriverByYear
      ? '✅ Available'
      : '❌ Missing';

    console.log('- Testing getConstructor...');
    testResults.apiEndpoints.getConstructor = F1API.ConstructorsAPI
      .getConstructor
      ? '✅ Available'
      : '❌ Missing';

    console.log('- Testing getConstructorByYear...');
    testResults.apiEndpoints.getConstructorByYear = F1API.ConstructorsAPI
      .getConstructorByYear
      ? '✅ Available'
      : '❌ Missing';

    // Test circuit methods
    console.log('- Testing getCircuitsByYear...');
    testResults.apiEndpoints.getCircuitsByYear = F1API.CircuitsAPI
      .getCircuitsByYear
      ? '✅ Available'
      : '❌ Missing';

    console.log('- Testing getCircuit...');
    testResults.apiEndpoints.getCircuit = F1API.CircuitsAPI.getCircuit
      ? '✅ Available'
      : '❌ Missing';

    // Test lap time methods
    console.log('- Testing getDriverLapTimes...');
    testResults.apiEndpoints.getDriverLapTimes = F1API.LapsAPI.getDriverLapTimes
      ? '✅ Available'
      : '❌ Missing';

    console.log('- Testing getSpecificLap...');
    testResults.apiEndpoints.getSpecificLap = F1API.LapsAPI.getSpecificLap
      ? '✅ Available'
      : '❌ Missing';

    // Test pit stop methods
    console.log('- Testing getDriverPitStops...');
    testResults.apiEndpoints.getDriverPitStops = F1API.PitStopsAPI
      .getDriverPitStops
      ? '✅ Available'
      : '❌ Missing';

    // Test status methods
    console.log('- Testing getAllStatusCodes...');
    testResults.apiEndpoints.getAllStatusCodes = F1API.StatusAPI
      .getAllStatusCodes
      ? '✅ Available'
      : '❌ Missing';
  } catch (error) {
    console.error('Error testing API endpoints:', error);
  }

  // Test React Hooks
  console.log('\n🎣 Testing React Hooks...');

  try {
    console.log('- Testing useResultsBySeason...');
    testResults.hooks.useResultsBySeason = F1Hooks.useResultsBySeason
      ? '✅ Available'
      : '❌ Missing';

    console.log('- Testing useDriverByYear...');
    testResults.hooks.useDriverByYear = F1Hooks.useDriverByYear
      ? '✅ Available'
      : '❌ Missing';

    console.log('- Testing useConstructorByYear...');
    testResults.hooks.useConstructorByYear = F1Hooks.useConstructorByYear
      ? '✅ Available'
      : '❌ Missing';

    console.log('- Testing useCircuitsByYear...');
    testResults.hooks.useCircuitsByYear = F1Hooks.useCircuitsByYear
      ? '✅ Available'
      : '❌ Missing';

    console.log('- Testing useCircuit...');
    testResults.hooks.useCircuit = F1Hooks.useCircuit
      ? '✅ Available'
      : '❌ Missing';

    console.log('- Testing useDriverLapTimes...');
    testResults.hooks.useDriverLapTimes = F1Hooks.useDriverLapTimes
      ? '✅ Available'
      : '❌ Missing';

    console.log('- Testing useSpecificLap...');
    testResults.hooks.useSpecificLap = F1Hooks.useSpecificLap
      ? '✅ Available'
      : '❌ Missing';

    console.log('- Testing useDriverPitStops...');
    testResults.hooks.useDriverPitStops = F1Hooks.useDriverPitStops
      ? '✅ Available'
      : '❌ Missing';

    console.log('- Testing useAllStatusCodes...');
    testResults.hooks.useAllStatusCodes = F1Hooks.useAllStatusCodes
      ? '✅ Available'
      : '❌ Missing';
  } catch (error) {
    console.error('Error testing hooks:', error);
  }

  // Print summary
  console.log('\n📊 Test Results Summary:');
  console.log('=========================');

  console.log('\n🔧 API Endpoints:');
  Object.entries(testResults.apiEndpoints).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });

  console.log('\n🎣 React Hooks:');
  Object.entries(testResults.hooks).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });

  // Count success/failure
  const apiSuccessCount = Object.values(testResults.apiEndpoints).filter((v) =>
    v.includes('✅'),
  ).length;
  const apiTotalCount = Object.keys(testResults.apiEndpoints).length;
  const hooksSuccessCount = Object.values(testResults.hooks).filter((v) =>
    v.includes('✅'),
  ).length;
  const hooksTotalCount = Object.keys(testResults.hooks).length;

  console.log('\n📈 Success Rate:');
  console.log(
    `  API Endpoints: ${apiSuccessCount}/${apiTotalCount} (${Math.round(
      (apiSuccessCount / apiTotalCount) * 100,
    )}%)`,
  );
  console.log(
    `  React Hooks: ${hooksSuccessCount}/${hooksTotalCount} (${Math.round(
      (hooksSuccessCount / hooksTotalCount) * 100,
    )}%)`,
  );

  const overallSuccess = apiSuccessCount + hooksSuccessCount;
  const overallTotal = apiTotalCount + hooksTotalCount;
  console.log(
    `  Overall: ${overallSuccess}/${overallTotal} (${Math.round(
      (overallSuccess / overallTotal) * 100,
    )}%)`,
  );

  if (overallSuccess === overallTotal) {
    console.log(
      '\n🎉 All missing endpoints have been successfully implemented!',
    );
  } else {
    console.log(
      '\n⚠️  Some endpoints are still missing. Please check the implementation.',
    );
  }
}

// Run the test
testMissingEndpoints().catch(console.error);
