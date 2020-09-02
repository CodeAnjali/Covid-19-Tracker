import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/GlobalData';
import { IDateWiseData } from 'src/app/models/DateWisedata';
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  data:GlobalDataSummary[];
  countries:String[]=[];
  totalConfirmed=0;
  totalActive=0;
  totalDeaths=0;
  totalRecovered=0;
  dateWiseData;
  selectedCountryData:IDateWiseData[]=[];
  constructor(private dataService:DataServiceService) { }

  lineChart:GoogleChartInterface={
    chartType:'LineChart'
  }

  
  ngOnInit(): void {
    this.dataService.getGlobaldata().subscribe(result=>
    {
      this.data=result;
      this.data.forEach(row=>{
        this.countries.push(row.country);
      })
    })
    this.dataService.getDateWiseData().subscribe(result=>
      {
        this.dateWiseData=result;
        //this.updateChart();
      }
      )
      
  }
update(selectedCountry)
{
  console.log(selectedCountry);
  this.data.forEach(row=>{
    if(row.country==selectedCountry)
    {
      this.totalConfirmed=row.confirmed;
      this.totalActive=row.active;
      this.totalDeaths=row.deaths;
      this.totalRecovered=row.recovered;
      
    }
  })
  this.selectedCountryData=this.dateWiseData[selectedCountry];
  console.log(this.selectedCountryData);
  //this.updateChart();
}
public pieChart: GoogleChartInterface = {
  chartType: 'PieChart'
}

/*updateChart()
  {
    
    let dataTable = [];
    dataTable.push(["Date",'Cases']);
    this.selectedCountryData.forEach(cs=>{
      dataTable.push([cs.date,cs.cases])
    });
    console.log(dataTable);
    this.lineChart={
      chartType:'LineChart',
      dataTable:dataTable,
      options:{height:500}
    };
    this.pieChart={
      chartType: 'PieChart',
      dataTable: [
        ['Task', 'Hours per Day'],
        ['Work',     11],
        ['Eat',      2],
        ['Commute',  2],
        ['Watch TV', 2],
        ['Sleep',    7]
      ],
      //firstRowIsData: true,
      options: {'title': 'Tasks'},
    };
  }*/

}

