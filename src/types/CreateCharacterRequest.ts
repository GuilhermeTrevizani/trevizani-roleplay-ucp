import { CharacterSex } from './CharacterSex';

export default interface CreateCharacterRequest {
  id?: string;
  name: string;
  sex: CharacterSex;
  age: number;
  history: string;
}