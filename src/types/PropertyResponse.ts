export default interface PropertyResponse {
  id: string;
  number: number;
  address: string;
  interiorDisplay: string;
  value: number;
  factionName: string;
  name?: string;
  parentPropertyNumber?: number;
  companyName: string;
  owner: string;
};