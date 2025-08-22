export default interface FactionEquipmentRequest {
  id?: string;
  name: string;
  factionId: string;
  propertyOrVehicle: boolean;
  swat: boolean;
  upr: boolean;
}