export default interface FactionResponse {
  id?: string;
  name: string;
  type: number;
  slots: number;
  typeDisplay: string;
  leader?: string;
  shortName: string;
}