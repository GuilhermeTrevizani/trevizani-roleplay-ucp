export default interface PremiumResponse {
  packages: PremiumPackage[];
  currentPurchaseName?: string;
  currentPurchasePreferenceId?: string;
  items: PremiumItem[];
}

export interface PremiumPackage {
  name: string;
  quantity: number;
  value: number;
  originalValue: number;
}

export interface PremiumItem {
  name: string;
  value: number;
}