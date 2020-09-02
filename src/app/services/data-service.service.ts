import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { GlobalDataSummary} from 'src/app/models/GlobalData'; 
import { IDateWiseData} from 'src/app/models/DateWisedata'; 

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private globalDataUrl = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/09-01-2020.csv";
  
  private dateWiseDataUrl="https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
  
  extension:String='.csv';
  month:number;
  date:number;
  year:number;
  
  getDate(d:number)
  {
    if(d<10)
      return '0'+d;
    return d;
  }
  constructor(private http:HttpClient) {
    let todayDate=new Date();
    this.date=todayDate.getDate();
    this.month=todayDate.getMonth();
    this.year=todayDate.getFullYear();
    console.log({
      date:this.date,
      month:this.month,
      year:this.year
    });
    
  }
  

  getDateWiseData()
  {
    return this.http.get(this.dateWiseDataUrl,{responseType:'text'}).pipe(
      map(result=>{
        let mainData={};
        let rows=result.split("\n");
        let header=rows[0];
        let dates=header.split(/,(?=\S)/);
        dates.splice(0,4);
        rows.forEach(row=>{
          let cols=row.split(/,(?=\S)/);
          let country=cols[1];
          cols.splice(0,4);
          mainData[country]=[];
          cols.forEach((value,index)=>{
              let dw:IDateWiseData={
                  cases:+value,
                  country:country,
                  date:new Date(Date.parse(dates[index]))
              }
              mainData[country].push(dw);
            })
          }
        )
       return mainData;
      })
    )
  }

  getGlobaldata()
  {
    return this.http.get(this.globalDataUrl,{ responseType:'text'}).pipe(
      map(result=>{
        let data:GlobalDataSummary[]=[];
        let raw={};
        let rows=result.split('\n');
        rows.splice(0,1);
        
        rows.forEach(row=>{
          let cols=row.split(/,(?=\S)/);
          let cs={
              country:cols[3],
              confirmed:+cols[7],
              deaths:+cols[8],
              recovered:+cols[9],
              active:+cols[10]
             };
            let temp:GlobalDataSummary=raw[cs.country];
            if(temp)
            {
              temp.active+=cs.active;
              temp.confirmed+=cs.confirmed;
              temp.deaths+=cs.deaths;
              temp.recovered+=cs.recovered;
              raw[cs.country]=temp;
            }
            else
              raw[cs.country]=cs;
            
            data.push(raw);
          });
            return <GlobalDataSummary[]>Object.values(raw);
          
      
      })
    ); 
    
 }
}
