export default interface PropertyResponse {
  id: string;
  number: number;
  address: string;
  interiorDisplay: string;
  value: number;
  entranceDimension: number;
  entrancePosX: number;
  entrancePosY: number;
  entrancePosZ: number;
  factionName: string;
  name?: string;
  exitPosX: number;
  exitPosY: number;
  exitPosZ: number;
  parentPropertyNumber?: number;
  companyName: string;
  owner: string;
};