import { Component, OnInit } from '@angular/core';
import { DataServiceService} from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/GlobalData';
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private dataService:DataServiceService) { }
  totalConfirmed=0;
  totalActive=0;
  totalDeaths=0;
  totalRecovered=0;
  loading = true;
  
  pieChart: GoogleChartInterface={
    chartType:'PieChart'
  };
  columnChart:GoogleChartInterface={
    chartType:'ColumnChart'
  }
  globaldata:GlobalDataSummary[]=[];

  initChart(caseType:string)
  {
    let globalDataTable=[];
    globalDataTable.push(['Country','Cases']);
    this.globaldata.forEach(row=>{
      let value:number;
      if(caseType=='c')
        value=row.confirmed;
      else if(caseType=='a')
        value=row.active;
      else if(caseType=='d')
        value=row.deaths;
      else
        value=row.recovered;
      if(value>10000)
        globalDataTable.push([row.country,value])
    });
    //console.log(globalDataTable);
    this.pieChart={
      chartType:'PieChart',
      dataTable:globalDataTable,
      options:{height:500}
    };
     
    this.columnChart={
      chartType:'ColumnChart',
      dataTable:globalDataTable,
      options:{height:500}
    };
  }


ngOnInit(): void {
    this.dataService.getGlobaldata()
    .subscribe(result=>{
          this.globaldata=result;
          result.forEach(row=>{
            if(!Number.isNaN(row.confirmed))
            {
              
            this.totalConfirmed+=row.confirmed;
            this.totalActive+=row.active;
            this.totalDeaths+=row.deaths;
            this.totalRecovered+=row.recovered;
            }
          } );
          this.initChart('c');
        });
  }
  
 updateChart(selectedRadio:HTMLInputElement)
  {
    //console.log(selectedRadio.value);
    this.initChart(selectedRadio.value);
    //console.log('update chart is called');
  }  

}
