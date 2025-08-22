import type { CharacterSex } from './CharacterSex';

export default interface CharacterResponse {
  id: string;
  name: string;
  sex: CharacterSex;
  sexDescription: string;
  age: number;
  history: string;
  canApplyNamechange: boolean;
  canResendApplication: boolean;
  registerDate: Date;
  factionName?: string;
  factionRankName?: string;
  job: string;
  connectedTime: number;
  cellphone: number;
  bank: number;
  attributes: string;
  rejectionReason?: string;
  staffer?: string;
  vehicles: CharacterVehicleResponse[];
  properties: CharacterPropertyResponse[];
  companies: CharacterCompanyResponse[];
}

export interface CharacterVehicleResponse {
  id: string;
  model: string;
  plate: string;
  charactersWithAccess: string[];
}

export interface CharacterPropertyResponse {
  id: string;
  number: string;
  address: string;
  charactersWithAccess: string[];
}

export interface CharacterCompanyResponse {
  id: string;
  name: string;
  safe: number;
  hasSafeAccess: boolean;
}