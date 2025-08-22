import type FactionCharacter from './FactionCharacter';
import type { FactionFlag } from './FactionFlag';
import type FactionRank from './FactionRank';
import type FactionVehicle from './FactionVehicle';

export default interface MyFactionDetailResponse {
  id: string;
  name: string;
  hasDuty: boolean;
  userFlags: FactionFlag[];
  color: string;
  chatColor: string;
  isLeader: boolean;
  flagsOptions: FlagOption[];
  characters: FactionCharacter[];
  vehicles: FactionVehicle[];
  ranks: FactionRank[];
}

export interface FlagOption {
  value: number;
  label: string;
}