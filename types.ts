
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  TRIAL = 'TRIAL',
  PREMIUM = 'PREMIUM',
  VIP = 'VIP'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  plan: SubscriptionPlan;
  apiKey: string;
  dataUsage: number;
  password?: string; // Optional for mock storage
  registeredAt?: string;
}

export interface BTSInfo {
  id: string;
  province: string;
  regency: string;
  district: string;
  village: string;
  operator: string;
  mcc: string;
  mnc: string;
  lac: string;
  cellId: string;
  lat: number;
  lng: number;
}

export interface CellIntelligence {
  msisdn: string;
  imei: string;
  imsi: string;
  iccid: string;
  device: string;
  brand: string;
  os: string;
  lastLac: string;
  lastCellId: string;
  lastLat: number;
  lastLng: number;
}
