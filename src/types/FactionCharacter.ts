
export default interface FactionCharacter {
  id: string;
  rankName: string;
  rankId: string;
  name: string;
  user: string;
  lastAccessDate: Date;
  isOnline: boolean;
  flagsJson: string;
  averageMinutesOnDutyLastTwoWeeks: number;
  flags: string[];
};