export default interface FactionEquipmentItemRequest {
  id?: string;
  factionEquipmentId: string;
  weapon: string;
  ammo: number;
  components: number[];
}