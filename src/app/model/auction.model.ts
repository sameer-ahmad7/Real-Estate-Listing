import { AgentInfo } from "./agent-model";

export interface AuctionProperty {
  id: number;
  link: string;
  date: string | Date;
  modified: string | Date;
  status: string;
  featured_media_thumbnail: string;
  type: string;
  title: {
    rendered: string;
  },
  content: {
    rendered: string;
  };
  district: string;
  broker: AgentInfo;
  srd: string;
  usd: string;
  landTitle: string;
  'wpcf-valuta': string//price;
  isEuro: boolean;
  isSrd: boolean;
  isUsd: boolean;
  eur: string;
  'wpcf-makelaar-naam': string,
'wpcf-makelaar-tel': string,
'wpcf-makelaar-mail': string,
  'wpcf-aantal-parkeerplaatsen': string //Parking spaces;
  'wpcf-aantal-kantoorruimtes': string //Offices
  'wpcf-kantoorruimte': string; //Office space
  'wpcf-aantal-kamers': string; //Rooms
  'wpcf-aantal-toiletten': string; //Toiles
  'wpcf-object-code': string; //object code
  'wpcf-perceel-diepte': string; //depth
  'wpcf-grondtitel': string; //business type
  'wpcf-etages': string; //floors
  'wpcf-frontbreedte-wegzijde': string; //width;
  'wpcf-koopobject-status': string; //buy status
  'wpcf-huurobject-status': string; //rental status
  'wpcf-straat': string; //street
  'wpcf-buurt': string; //neighbourhood
  'wpcf-huurprijs-pm-zp': string; //rental price
  'wpcf-district': string; //select value
  'wpcf-kaart': string; //coordinates
  'wpcf-object-gallerij': string; //image url
  'wpcf-prijs-zonder-punten': string; //price
  'wpcf-aantal-badkamers': string;//bathroom
  'wpcf-perceeloppervlakte': string //land-area
  'wpcf-aantal-slaapkamers': string; //bedrooms
  'wpcf-bouwoppervlakte': string; //building area
  'wpcf-type-zakenpand': string; //business type;
  'toolset-meta': {
    veilingsdatum: {
      'datum-veiling': {
      type: string,
      raw: string,
      formatted: string
      },
      'tijd-veiling': {
      type: string,
      raw: string
      },
      'makelaar-naam': {
      type: string,
      raw:string
      },
      'locatie-veiling': {
      type: string,
      raw: string
      },
      'makelaar-tel': {
      type: string,
      raw: string
      },
      'download-link': {
      type: string,
      raw:string
      }
      },
      'veiling-status-details': {
      'veiling-optie': {
      type: string,
      raw: string
      },
      'koopobject-status': {
      type: string,
      raw: string
      }
      },
    'object-media': {
      'object-gallerij': { //galleries

        type: "image",
        raw: string[],
        repeatable: { raw: string; attachment_id: number }[];

      }
    }
    'details-veiling': {
      subtitel: {
        type: string;
        raw: string;
      }
    }
  }
}

//location should be displayed as wpcf-buurt, district,

export interface BusinessType {
  value: string;
  label: string;
}
