// Simple verification script for ES modules
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying F1 API implementation...');

// Get file paths for new modular structure
const apiPath = path.resolve(__dirname, '../src/services/api.js');
const hooksPath = path.resolve(__dirname, '../src/services/hooks.js');
const atomsIndexPath = path.resolve(__dirname, '../src/state/atoms/index.js');
const actionsIndexPath = path.resolve(
  __dirname,
  '../src/state/actions/index.js',
);
const hooksIndexPath = path.resolve(__dirname, '../src/state/hooks/index.js');
const stateIndexPath = path.resolve(__dirname, '../src/state/index.js');

// Check that files exist
console.log('Checking files:');
console.log(fs.existsSync(apiPath) ? '✅' : '❌', 'API file');
console.log(fs.existsSync(hooksPath) ? '✅' : '❌', 'Hooks service file');
console.log(
  fs.existsSync(atomsIndexPath) ? '✅' : '❌',
  'Atoms index (modular)',
);
console.log(
  fs.existsSync(actionsIndexPath) ? '✅' : '❌',
  'Actions index (modular)',
);
console.log(
  fs.existsSync(hooksIndexPath) ? '✅' : '❌',
  'Hooks index (modular)',
);
console.log(fs.existsSync(stateIndexPath) ? '✅' : '❌', 'State main index');

// Read file contents from modular structure
const apiContent = fs.readFileSync(apiPath, 'utf8');
const hooksContent = fs.readFileSync(hooksPath, 'utf8');

// For modular structure, we check the main index files
let atomsContent = '';
let actionsContent = '';
try {
  atomsContent = fs.readFileSync(atomsIndexPath, 'utf8');
  actionsContent = fs.readFileSync(actionsIndexPath, 'utf8');
} catch (e) {
  console.log(
    'Note: Using modular structure - checking main state index instead',
  );
  const stateContent = fs.readFileSync(stateIndexPath, 'utf8');
  atomsContent = stateContent;
  actionsContent = stateContent;
}

// Required endpoints
const requiredEndpoints = [
  // Drivers
  'getDriver',
  'getDriverByYear',
  // Constructors
  'getConstructor',
  'getConstructorByYear',
  // Circuits
  'getCircuitsByYear',
  'getCircuit',
  // Lap Times
  'getDriverLapTimes',
  'getSpecificLap',
  // Pit Stops
  'getDriverPitStops',
  // Status Codes
  'getAllStatusCodes',
  // Results
  'getResultsBySeason',
];

// Required hooks
const requiredHooks = [
  'useDriverByYear',
  'useDriver',
  'useConstructorByYear',
  'useConstructor',
  'useCircuitsByYear',
  'useCircuit',
  'useDriverLapTimes',
  'useSpecificLap',
  'useDriverPitStops',
  'useStatusCodes',
  'useResultsBySeason',
];

// Required atoms
const requiredAtoms = [
  'selectedDriverDetailsAtom',
  'selectedConstructorDetailsAtom',
  'circuitsByYearAtom',
  'selectedCircuitDetailsAtom',
  'driverLapTimesAtom',
  'specificLapAtom',
  'driverPitStopsAtom',
  'statusCodesAtom',
  'resultsBySeasonAtom',
];

// Required actions
const requiredActions = [
  'fetchDriverDetailsAtom',
  'fetchDriverByYearAtom',
  'fetchConstructorDetailsAtom',
  'fetchConstructorByYearAtom',
  'fetchCircuitsByYearAtom',
  'fetchCircuitDetailsAtom',
  'fetchDriverLapTimesAtom',
  'fetchSpecificLapAtom',
  'fetchDriverPitStopsAtom',
  'fetchStatusCodesAtom',
  'fetchResultsBySeasonAtom',
];

// Check API endpoints
console.log('\n📡 API Endpoints:');
let implementedEndpoints = 0;
requiredEndpoints.forEach((endpoint) => {
  const found =
    apiContent.includes(endpoint + ': ') ||
    apiContent.includes(endpoint + ' ') ||
    apiContent.includes(endpoint + '(');
  console.log(found ? '✅' : '❌', endpoint);
  if (found) implementedEndpoints++;
});

// Check hooks
console.log('\n🪝 Hooks:');
let implementedHooks = 0;
requiredHooks.forEach((hook) => {
  const found = hooksContent.includes('export const ' + hook + ' =');
  console.log(found ? '✅' : '❌', hook);
  if (found) implementedHooks++;
});

// Check atoms
console.log('\n⚛️ Atoms:');
let implementedAtoms = 0;
requiredAtoms.forEach((atom) => {
  const found = atomsContent.includes('export const ' + atom + ' =');
  console.log(found ? '✅' : '❌', atom);
  if (found) implementedAtoms++;
});

// Check actions
console.log('\n🎬 Actions:');
let implementedActions = 0;
requiredActions.forEach((action) => {
  const found = actionsContent.includes('export const ' + action + ' =');
  console.log(found ? '✅' : '❌', action);
  if (found) implementedActions++;
});

// Summary
console.log('\n📊 Implementation Summary:');
console.log(
  `API Endpoints: ${implementedEndpoints}/${
    requiredEndpoints.length
  } (${Math.round((implementedEndpoints / requiredEndpoints.length) * 100)}%)`,
);
console.log(
  `Hooks: ${implementedHooks}/${requiredHooks.length} (${Math.round(
    (implementedHooks / requiredHooks.length) * 100,
  )}%)`,
);
console.log(
  `Atoms: ${implementedAtoms}/${requiredAtoms.length} (${Math.round(
    (implementedAtoms / requiredAtoms.length) * 100,
  )}%)`,
);
console.log(
  `Actions: ${implementedActions}/${requiredActions.length} (${Math.round(
    (implementedActions / requiredActions.length) * 100,
  )}%)`,
);

// Overall completion
const totalRequired =
  requiredEndpoints.length +
  requiredHooks.length +
  requiredAtoms.length +
  requiredActions.length;
const totalImplemented =
  implementedEndpoints +
  implementedHooks +
  implementedAtoms +
  implementedActions;
const completionPercentage = Math.round(
  (totalImplemented / totalRequired) * 100,
);

console.log(`\n🏁 Overall Completion: ${completionPercentage}%`);

if (completionPercentage === 100) {
  console.log('🎉 SUCCESS! All required endpoints are implemented!');
} else if (completionPercentage >= 80) {
  console.log('✅ ALMOST THERE! Most features are implemented.');
  console.log('   Missing items are listed above with ❌');
} else {
  console.log('⚠️ INCOMPLETE! Please implement the missing features.');
  console.log('   Missing items are listed above with ❌');
}
