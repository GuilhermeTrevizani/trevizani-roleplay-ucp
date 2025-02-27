export default interface LogRequest {
  startDate?: Date;
  endDate?: Date;
  type?: number;
  originCharacter?: string;
  originIp?: string;
  originUser?: string;
  originSocialClubName?: string;
  targetCharacter?: string;
  targetIp?: string;
  targetUser?: string;
  targetSocialClubName?: string;
  description?: string;
}