import { CharacterStatus } from './CharacterStatus';

export interface MyCharactersResponse {
  createCharacterWarning?: string;
  characters: MyCharactersCharacterResponse[];
}

export interface MyCharactersCharacterResponse {
  id: string;
  name: string;
  lastAccessDate: Date;
  deathReason?: string;
  status: CharacterStatus;
}