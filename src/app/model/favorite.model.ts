export interface Favorite {
  id: string;
  type: ListingType;
}

export enum ListingType {
  HOME = 0,
  RENTALHOME = 1,
  BUSINESSPROPERTY = 2,
  RENTALBUSINESSPROPERTY = 3,
  PLOT = 4,
  VACATIONRENTALS = 5
}
