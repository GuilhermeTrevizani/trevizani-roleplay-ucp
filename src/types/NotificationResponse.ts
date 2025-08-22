export default interface NotificationResponse {
  id: string;
  date: Date;
  message: string;
  readDate?: Date;
}