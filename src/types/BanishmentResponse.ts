export default interface BanishmentResponse {
  id: string;
  date: Date;
  expirationDate?: Date;
  reason: string;
  character: string;
  user: string;
  userStaff: string;
  onlyCharacterIsBanned: boolean;
}