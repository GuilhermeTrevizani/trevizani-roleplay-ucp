import { CharacterStatus } from './CharacterStatus';

export default interface MyCharactersResponse {
  createCharacterWarning?: string;
  characters: MyCharactersCharacterResponse[];
}

export interface MyCharactersCharacterResponse {
  id: string;
  name: string;
  lastAccessDate: Date;
  canApplyNamechange: boolean;
  canResendApplication: boolean;
  deathReason?: string;
  status: CharacterStatus;
}