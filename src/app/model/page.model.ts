export interface PageInfo{
  id:number;
  date:string;
  date_gmt:string;
  slug:string;
  title:{
    rendered:string;
  }
  content:{
    rendered:string;
  }
}
