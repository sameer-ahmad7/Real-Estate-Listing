export interface FAQ{
  id: number;
date: string;
date_gmt: string;
title:{
  rendered:string;
}
content:{
  rendered:string;
}
menu_order:number;
}

export enum FaqType{
  Appraisals=1,
  Buy=2,
  Sell=3,
  Rent=4,
  Rental=5,
  Mortgage=6,
  Advertising=7
}
