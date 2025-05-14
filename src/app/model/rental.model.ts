export interface Rental {
  id: number;
  date: string | Date;
  modified: string | Date;
  status: string;
  type: string;
  title: {
    rendered: string;
  },
  content: {
    rendered: string;
  };
  district: string;
  'wpcf-straat': string; //street
  'wpcf-buurt': string; //neighbourhood
  'wpcf-district': string; //select value
  'wpcf-kaart': string; //coordinates
  'wpcf-object-gallerij': string; //image url
  'wpcf-prijs-zonder-punten': string; //price
  'wpcf-huurprijs-pm-zp': string; //rent
  'wpcf-aantal-badkamers': string;//bathroom
  'wpcf-aantal-slaapkamers': string; //bedrooms
  'wpcf-bouwoppervlakte': string; //building area,
  'toolset-meta': {
    'details-huurwoning': {
      subtitel: {
        type: string;
        raw: string;
      }
    }
  }

}

//location should be displayed as wpcf-buurt, district,
