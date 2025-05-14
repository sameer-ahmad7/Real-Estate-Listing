import { AgentInfo } from "./agent-model";

export interface Plot {
  id: number;
  date: string | Date;
  modified: string | Date;
  gallery_thumbnails:{thumbnail:string;full:string}[];
  status: string;
  type: string;
  title: {
    rendered: string;
  },
  content: {
    rendered: string;
  };
  district: string;
  broker: AgentInfo;
  landTitle: string;
  eur: string;
  srd: string;
  usd: string;
  'wpcf-object-code': string;
  'wpcf-koopobject-status': string;
  'wpcf-perceel-diepte': string; //depth
  'wpcf-etages': string; //floors
  'wpcf-frontbreedte-wegzijde': string; //width;
  'wpcf-grondtitel': string; //plot type
  'wpcf-bodemgesteldheid': string; //soil
  'wpcf-straat': string; //street
  'wpcf-buurt': string; //neighbourhood
  'wpcf-district': string; //select value
  'wpcf-kaart': string; //coordinates
  'wpcf-object-gallerij': string; //image url
  'wpcf-prijs-zonder-punten': string; //price
  'wpcf-aantal-badkamers': string;//bathroom
  'wpcf-aantal-slaapkamers': string; //bedrooms
  'wpcf-bouwoppervlakte': string; //building area
  'wpcf-perceeloppervlakte': string //land-area
  'wpcf-huurprijs-pm-zp': string; //price for land
  'wpcf-valuta': string//price;
  isEuro: boolean;
  isSrd: boolean;
  featured_media_thumbnail: string;
  link: string;
  isUsd: boolean;
  'toolset-meta': {
    'object-media': {
      'object-gallerij': { //galleries
        type: "image",
        raw: string[],
        repeatable: { raw: string; attachment_id: number }[];
      }
    },
    'details-perceel': {
      subtitel: {
        type: string;
        raw: string;
      }
    }
  }
}

//location should be displayed as wpcf-buurt, district,
