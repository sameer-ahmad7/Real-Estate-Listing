import { AgentInfo } from "./agent-model";

export interface HomeTypes {
  title: string;
  value: string;
  order: number;
}

export interface HouseStatus {
  title: string;
  value: string;
}



export interface Home {
  id: number;
  link: string;
  date: string | Date;
  modified: string | Date;
  featured_media_thumbnail: string;
  status: string;
  type: string;
  usd?: string;
  srd?: string;
  title: {
    rendered: string;
  },
  content: {
    rendered: string;
  };
  district: string;
  gallery_thumbnails:{thumbnail:string;full:string}[];
  broker: AgentInfo;
  'wpcf-huurobject-status': string; //rental status
  'wpcf-koopobject-status': string; //house status
  'wpcf-object-code': string; //object code
  'wpcf-huurprijs-pm-zp': string; //rental price
  'wpcf-straat': string; //street
  'wpcf-buurt': string; //neighbourhood
  'wpcf-district': string; //select value
  'wpcf-kaart': string; //coordinates "{5.842395,-55.292710}"
  'wpcf-object-gallerij': string; //image url
  'wpcf-prijs-zonder-punten': string; //price
  'wpcf-vraagprijs': string; //euro price
  'wpcf-aantal-badkamers': string;//bathroom
  'wpcf-aantal-slaapkamers': string; //bedrooms
  'wpcf-bouwoppervlakte': string; //building area
  'wpcf-perceeloppervlakte': string; //plot area
  'wpcf-type-woning': string; //house type
  'wpcf-etages': string; // floors
  'wpcf-valuta': string//price;
  isEuro: boolean;
  isSrd: boolean;
  isUsd: boolean;
  eur: string;
  'toolset-meta': {
    'object-media': {
      'object-gallerij': { //galleries
        type: string;
        raw: string[];
        repeatable: { raw: string; attachment_id: number }[];
      }
    }
    'details-koopwoning': {
      subtitel: {
        type: string;
        raw: string;
      }
    },
    'details-huurwoning': {
      subtitel: {
        type: string;
        raw: string;
      }

    }

  }
}

//location should be displayed as wpcf-buurt, district,
