import { AgentInfo } from "./agent-model";

export interface HolidayHome {
  id: number;
  date: string | Date;
  modified: string | Date;
  link: string;
  status: string;
  featured_media_thumbnail: string;
  broker: AgentInfo;
  gallery_thumbnails:{thumbnail:string;full:string}[];
  type: string;
  title: {
    rendered: string;
  },
  content: {
    rendered: string;
  };
  district: string;
  usdPerDay: string;
  eurPerDay: string;
  srdPerDay: string;
  usdPerWeek: string;
  eurPerWeek: string;
  srdPerWeek: string;
  'wpcf-object-code': string;
  'wpcf-type-woning': string; //house type
  'wpcf-etages': string; //floors
  'wpcf-huurobject-status': string; //status
  'wpcf-straat': string; //street
  'wpcf-buurt': string; //neighbourhood
  'wpcf-district': string; //select value
  'wpcf-kaart': string; //coordinates
  'wpcf-object-gallerij': string; //image url
  'wpcf-prijs-zonder-punten': string; //price
  'wpcf-aantal-badkamers': string;//bathroom
  'wpcf-perceeloppervlakte': string //land-area
  'wpcf-aantal-slaapkamers': string; //bedrooms
  'wpcf-bouwoppervlakte': string; //building area
  'wpcf-aantal-kamers': string;//rooms
  'wpcf-valuta': string//price;
  isEuro: boolean;
  isSrd: boolean;
  isUsd: boolean;
  eur: string;
  'toolset-meta': {
    'object-media': {
      'object-gallerij': { //galleries

        type: "image",
        raw: string[],
        repeatable: { raw: string; attachment_id: number }[];

      }
    },
    'details-vakantiewoning': {
      subtitel: {
        type: string;
        raw: string;
      }
    },
    'huurprijs-vakantiewoning': {
      'huurprijs-per-week': {
        type: string;
        raw: string;
      },
      'huurprijs-per-dag': {
        type: string;
        raw: string;
      }
    }
  }
}

//location should be displayed as wpcf-buurt, district,
