export default interface PremiumPointPurchaseResponse {
  userOrigin: string;
  userTarget: string;
  quantity: number;
  value: number;
  registerDate: Date;
  status: string;
  paymentDate?: Date;
}