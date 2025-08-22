export default interface OrderFactionRanksRequest {
  factionId: string;
  ranks: OrderFactionRanksRankRequest[]
}

export interface OrderFactionRanksRankRequest {
  id: string;
  position: number;
}