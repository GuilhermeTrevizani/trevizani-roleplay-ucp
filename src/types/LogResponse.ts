export default interface LogResponse {
  id: string;
  type: string;
  date: Date;
  description: string;
  originCharacter: string;
  originIp: string;
  originSocialClubName: string;
  originUser: string;
  targetCharacter: string;
  targetIp: string;
  targetSocialClubName: string;
  targetUser: string;
}