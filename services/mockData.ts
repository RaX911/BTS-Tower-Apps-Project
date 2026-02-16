
import { BTSInfo, CellIntelligence } from '../types.ts';
import { PROVINCES } from '../constants.tsx';

export const generateRandomBTS = (count: number): BTSInfo[] => {
  const operators = ['Telkomsel', 'Indosat Ooredoo', 'XL Axiata', 'Smartfren', 'Three'];
  const btsList: BTSInfo[] = [];

  for (let i = 0; i < count; i++) {
    const province = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
    btsList.push({
      id: `BTS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      province,
      regency: 'Kabupaten ' + (i % 10),
      district: 'Kecamatan ' + (i % 50),
      village: 'Desa ' + (i % 100),
      operator: operators[Math.floor(Math.random() * operators.length)],
      mcc: '510',
      mnc: ['10', '01', '11', '09', '89'][Math.floor(Math.random() * 5)],
      lac: Math.floor(Math.random() * 65535).toString(),
      cellId: Math.floor(Math.random() * 65535).toString(),
      lat: -8.0 + (Math.random() * 10 - 5),
      lng: 115.0 + (Math.random() * 20 - 10)
    });
  }
  return btsList;
};

export const intelLookup = (msisdn: string): CellIntelligence => {
  const brands = ['Samsung', 'Apple', 'Xiaomi', 'Oppo', 'Vivo'];
  const models = ['S23 Ultra', 'iPhone 15 Pro', 'Redmi Note 12', 'Reno 10', 'V27'];
  const idx = Math.floor(Math.random() * 5);
  
  return {
    msisdn,
    imei: `35${Math.floor(Math.random() * 10000000000000).toString().padStart(13, '0')}`,
    imsi: `510${Math.floor(Math.random() * 100000000000).toString().padStart(12, '0')}`,
    iccid: `8962${Math.floor(Math.random() * 1000000000000000).toString().padStart(16, '0')}`,
    device: models[idx],
    brand: brands[idx],
    os: brands[idx] === 'Apple' ? 'iOS 17.2' : 'Android 14',
    lastLac: Math.floor(Math.random() * 65535).toString(),
    lastCellId: Math.floor(Math.random() * 65535).toString(),
    lastLat: -6.2088 + (Math.random() * 0.1),
    lastLng: 106.8456 + (Math.random() * 0.1)
  };
};
