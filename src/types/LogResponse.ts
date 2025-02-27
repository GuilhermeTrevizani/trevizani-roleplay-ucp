export default interface LogResponse {
  id: string;
  type: string;
  date: Date;
  description: string;
  originCharacterName: string;
  originIp: string;
  originSocialClubName: string;
  targetCharacterName: string;
  targetIp: string;
  targetSocialClubName: string;
}