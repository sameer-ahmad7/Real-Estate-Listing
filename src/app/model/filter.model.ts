export interface IFilter {
  search?: string;
  priceRange?: string;
  type: DataTypes[];
  isRental?: boolean;
  excludeId?: string;
}

export interface HouseFilter {
  search?: string;
  priceRange?: string;
  type?: string;
  district?: string;
  constructionArea?: string;
  plotArea?: string;
  landTitle?: string;
}

export interface BusinessPropertyFilter {
  search?: string;
  priceRange?: string;
  propertyType?: string;
  district?: string;
  constructionArea?: string;
  plotArea?: string;
  landTitle?: string;
}


export interface HolidayHomeFilter {
  search?: string;
  priceRange?: string;
  type?: string;
  district?: string;
}

export interface PlotFilter {
  search?: string;
  priceRange?: string;
  district?: string;
  landTitle?: string;
  plotArea?: string;
}


export enum DataTypes {
  HOME = 1,
  PLOT = 2,
  BUSINESS_PROPERTY = 3,
  HOLIDAY_HOME = 4
}

