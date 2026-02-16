import { BTSInfo, CellIntelligence } from '../types';
import { PROVINCES } from '../constants';

const getOperatorFromMsisdn = (msisdn: string) => {
  // Indonesian MSISDN Mapping
  if (msisdn.startsWith('62811') || msisdn.startsWith('62812') || msisdn.startsWith('62813') || msisdn.startsWith('62821') || msisdn.startsWith('62822') || msisdn.startsWith('62852') || msisdn.startsWith('62853') || msisdn.startsWith('62851')) return 'Telkomsel';
  if (msisdn.startsWith('62814') || msisdn.startsWith('62815') || msisdn.startsWith('62816') || msisdn.startsWith('62855') || msisdn.startsWith('62856') || msisdn.startsWith('62857') || msisdn.startsWith('62858')) return 'Indosat Ooredoo';
  if (msisdn.startsWith('62817') || msisdn.startsWith('62818') || msisdn.startsWith('62819') || msisdn.startsWith('62859') || msisdn.startsWith('62877') || msisdn.startsWith('62878')) return 'XL Axiata';
  if (msisdn.startsWith('62895') || msisdn.startsWith('62896') || msisdn.startsWith('62897') || msisdn.startsWith('62898') || msisdn.startsWith('62899')) return 'Three (H3I)';
  if (msisdn.startsWith('62881') || msisdn.startsWith('62882') || msisdn.startsWith('62883') || msisdn.startsWith('62884') || msisdn.startsWith('62885') || msisdn.startsWith('62886') || msisdn.startsWith('62887') || msisdn.startsWith('62888') || msisdn.startsWith('62889')) return 'Smartfren';
  return 'Global Roaming / MVNO';
};

export const generateRandomBTS = (count: number): BTSInfo[] => {
  const operators = ['Telkomsel', 'Indosat Ooredoo', 'XL Axiata', 'Smartfren', 'Three'];
  const btsList: BTSInfo[] = [];

  for (let i = 0; i < count; i++) {
    const province = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
    btsList.push({
      id: `BTS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      province,
      regency: 'KAB. ' + (i % 15),
      district: 'KEC. ' + (i % 30),
      village: 'KEL. ' + (i % 50),
      operator: operators[Math.floor(Math.random() * operators.length)],
      mcc: '510',
      mnc: ['10', '01', '11', '09', '89'][Math.floor(Math.random() * 5)],
      lac: (1000 + Math.floor(Math.random() * 9000)).toString(),
      cellId: (10000 + Math.floor(Math.random() * 50000)).toString(),
      lat: -8.0 + (Math.random() * 10 - 5),
      lng: 115.0 + (Math.random() * 20 - 10),
      frequency: (900 + Math.random() * 1200).toFixed(1) + ' MHz',
      power: (30 + Math.random() * 30).toFixed(0) + ' dBm'
    });
  }
  return btsList;
};

export const intelLookup = (msisdn: string): CellIntelligence => {
  const brands = ['Samsung', 'Apple', 'Xiaomi', 'Oppo', 'Vivo'];
  const models = ['S24 Ultra (SM-928B)', 'iPhone 15 Pro Max (A3106)', 'Xiaomi 14 Ultra', 'Oppo Find X7 Ultra', 'Vivo X100 Pro'];
  const modulations = ['256QAM (DL) / 64QAM (UL)', '16QAM', 'QPSK'];
  const bands = ['LTE Band 3 (1800)', 'LTE Band 1 (2100)', 'LTE Band 8 (900)', 'LTE Band 40 (2300)', 'n1 (NR 5G)', 'n3 (NR 5G)'];
  const idx = Math.floor(Math.random() * 5);
  
  const op = getOperatorFromMsisdn(msisdn);
  
  // Simulation of timing advance to estimate distance
  const ta = 100 + Math.floor(Math.random() * 5000); 

  return {
    msisdn,
    operator: op,
    status: Math.random() > 0.2 ? 'ACTIVE' : 'IDLE',
    imei: `35${Math.floor(Math.random() * 10000000000000).toString().padStart(13, '0')}`,
    imsi: `510${op === 'Telkomsel' ? '10' : op === 'Indosat Ooredoo' ? '01' : '11'}${Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')}`,
    iccid: `8962${Math.floor(Math.random() * 1000000000000000).toString().padStart(16, '0')}`,
    tmsi: Math.random().toString(16).substr(2, 8).toUpperCase(),
    device: models[idx],
    brand: brands[idx],
    os: brands[idx] === 'Apple' ? 'iOS 17.5.1' : 'Android 14 (Global ROM)',
    
    signalStrength: -50 - Math.floor(Math.random() * 60),
    snr: 12 + Math.random() * 20,
    modulation: modulations[Math.floor(Math.random() * modulations.length)],
    band: bands[Math.floor(Math.random() * bands.length)],
    frequency: 1800 + Math.random() * 300,
    
    lastLac: (3000 + Math.floor(Math.random() * 6000)).toString(),
    lastCellId: (20000 + Math.floor(Math.random() * 40000)).toString(),
    timingAdvance: ta,
    accuracy: 99.1 + Math.random() * 0.9,
    lastLat: -6.2088 + (Math.random() * 0.1 - 0.05),
    lastLng: 106.8456 + (Math.random() * 0.1 - 0.05),
    timestamp: new Date().toISOString()
  };
};