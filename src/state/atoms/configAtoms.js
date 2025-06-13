/**
 * Configuration Atoms
 *
 * Atoms for managing application configuration state like selected year,
 * round, driver, constructor, and circuit selections.
 */

import { atom } from 'jotai';
import { APP_CONFIG } from '../../config';

// =============================================================================
// CONFIGURATION ATOMS
// =============================================================================

/**
 * Current selected season year
 */
export const selectedYearAtom = atom(APP_CONFIG.defaultSeason);

/**
 * Current selected race round
 */
export const selectedRoundAtom = atom(APP_CONFIG.defaultRound);

/**
 * Selected driver ID for detailed view
 */
export const selectedDriverAtom = atom(null);

/**
 * Selected constructor ID for detailed view
 */
export const selectedConstructorAtom = atom(null);

/**
 * Selected circuit ID for detailed view
 */
export const selectedCircuitAtom = atom(null);
