import { CharacterSex } from './CharacterSex';

export default interface CreateCharacterInfoResponse {
  name: string;
  sex: CharacterSex;
  age: number;
  history: string;
  rejectionReason?: string;
  staffer?: string;
}