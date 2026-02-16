export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  TRIAL = 'TRIAL',
  BASIC = 'BASIC',
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
  password?: string;
  registeredAt?: string;
  lastLogin?: string;
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
  frequency: string;
  power: string;
}

export interface CellIntelligence {
  msisdn: string;
  imei: string;
  imsi: string;
  iccid: string;
  tmsi: string; // Temporary Mobile Subscriber Identity
  device: string;
  brand: string;
  os: string;
  operator: string;
  status: 'ACTIVE' | 'IDLE' | 'DETACHED';
  
  // SDR Parameters
  signalStrength: number; // dBm
  snr: number; // Signal-to-noise ratio
  modulation: string; // QPSK, 16QAM, etc
  band: string; // LTE Band 1, 3, 40
  frequency: number; // MHz
  
  // RTL / Location Details
  lastLac: string;
  lastCellId: string;
  timingAdvance: number; // Estimate distance in meters
  accuracy: number; // Percentage
  lastLat: number;
  lastLng: number;
  timestamp: string;
}