import type { FactionFlag } from './FactionFlag';

export default interface SaveFactionMemberRequest {
  id: string;
  factionId: string;
  factionRankId: string;
  flags: FactionFlag[];
}