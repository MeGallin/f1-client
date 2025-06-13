/**
 * Simple validation script to test modular imports
 */

import fs from 'fs';
import path from 'path';

console.log('Testing modular state file structure...');

const checkFileExists = (filePath) => {
  const fullPath = path.resolve(filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✓ ${filePath} exists`);
    return true;
  } else {
    console.log(`❌ ${filePath} missing`);
    return false;
  }
};

let allGood = true;

// Check atoms files
console.log('\nChecking atoms files:');
allGood &= checkFileExists('./src/state/atoms/index.js');
allGood &= checkFileExists('./src/state/atoms/configAtoms.js');
allGood &= checkFileExists('./src/state/atoms/uiAtoms.js');
allGood &= checkFileExists('./src/state/atoms/dataAtoms.js');
allGood &= checkFileExists('./src/state/atoms/derivedAtoms.js');

// Check actions files
console.log('\nChecking actions files:');
allGood &= checkFileExists('./src/state/actions/index.js');
allGood &= checkFileExists('./src/state/actions/actionUtils.js');
allGood &= checkFileExists('./src/state/actions/seasonActions.js');
allGood &= checkFileExists('./src/state/actions/raceActions.js');
allGood &= checkFileExists('./src/state/actions/driverActions.js');
allGood &= checkFileExists('./src/state/actions/constructorActions.js');

// Check hooks files
console.log('\nChecking hooks files:');
allGood &= checkFileExists('./src/state/hooks/index.js');
allGood &= checkFileExists('./src/state/hooks/useConfiguration.js');
allGood &= checkFileExists('./src/state/hooks/useUIState.js');
allGood &= checkFileExists('./src/state/hooks/useSeasons.js');
allGood &= checkFileExists('./src/state/hooks/useRaces.js');

if (allGood) {
  console.log('\n🎉 All modular files exist!');
} else {
  console.log('\n❌ Some files are missing');
  process.exit(1);
}
