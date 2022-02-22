/* eslint-disable @typescript-eslint/no-unused-vars */
import { L, E, V } from './utils';

const RarityTier = { 
  Legendary:  { top: 0.001, color: { light: '#000', dark: '#FCA' }, },
  Epic: { top: 0.01, color: { light: '#000', dark: '#CAF' }, },
  Rare: { top: 0.1, color: { light: '#000', dark: '#ACF' }, },
  Uncommon: { top: 0.5, color: { light: '#000', dark: '#AFC' }, },
  Common: { top: Infinity, color: { light: '#000', dark: '#CCC' }, },
}

let determineRarityTier = (rank: number, tokenCount: number) => { return rank === 1 ? 0 : V(RarityTier).findIndex(x => rank / tokenCount <= x.top); }

export { RarityTier, determineRarityTier }