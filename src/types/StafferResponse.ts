export default interface StafferResponse {
  staff: string;
  name: string;
  helpRequestsAnswersQuantity: number;
  characterApplicationsQuantity: number;
  staffDutyTime: number;
  connectedTime: number;
  flags: string[];
  lastAccessDate: Date;
}