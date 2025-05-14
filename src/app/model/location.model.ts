export interface GeocodeLocation {
  address: AddressInfo;
}

export interface AddressInfo {
  lat: number;
  lng: number;
  road: string;
  residential: string;
  village: string;
  county: string;
  state: string;
  country: string;
  country_code: string;
}
