import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  AfterViewInit,
  SimpleChanges
} from "@angular/core";
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";
declare var $: JQueryStatic;

@Component({
  selector: "app-graph",
  templateUrl: "./graph.component.html",
  styleUrls: ["./graph.component.css"]
})
export class GraphComponent implements OnInit, OnDestroy, OnChanges {
  @Input() dataSet;
  @Input() apiData;
  graphData = [];
  innerdata = [];
  // data = [];
  newData;
  dataObj = {
    month: null as string,
    value: null as number,
    value1: null as number
  };

  public options: any;
  private chart2: AmChart;
  private timer: any;

  constructor(private AmCharts: AmChartsService) {}
  makeDataSet() {
    const data = [];
    for (var i = 0; i < this.dataSet.dates.length; i++) {
      data.push({
        month: new Date(this.dataSet.dates[i]),
        value1: +this.dataSet.benchMark[i],
        value: +this.dataSet.fundReturn[i]
      });
    }
    data.sort(function(_a, _b) {
      const a: any = _a.month;
      const b: any = _b.month;
      const aYear: any = a.getFullYear();
      const bYear: any = b.getFullYear();
      return b - a && aYear - bYear;
    });
    return data;
  }

  makeOptions(dataProvider) {
    let vTitle = 'R 1000 initial investment'
    let vLabel = 'R'
    if(this.apiData.slug === "global-equity-fund" || this.apiData.slug === "islamic-global-equity-fund") {
      vTitle = '$10 000 initial investment';
      vLabel = '$';
    }
    function getMonthNameByNum(pNum) {
      switch (pNum) {
        case 0:
          return "Jan";
          break;
        case 1:
          return "Feb";
          break;
        case 2:
          return "Mar";
          break;
        case 3:
          return "Apr";
          break;
        case 4:
          return "May";
          break;
        case 5:
          return "Jun";
          break;
        case 6:
          return "Jul";
          break;
        case 7:
          return "Aug";
          break;
        case 8:
          return "Sep";
          break;
        case 9:
          return "Oct";
          break;
        case 10:
          return "Nov";
          break;
        case 11:
          return "Dec";
          break;
        default:
          return "";
          break;
      }
    }
    return {
      type: "serial",
      theme: "light",
      color:"gray",
      marginTop: 25,
      marginRight: 25,
      dataProvider: dataProvider,
      valueAxes: [
        {
          vLabel,
          title: vTitle,
          titleBold: false,
          titleFontSize: 13,
          id: "v1",
          position: "left",
          axisThickness:1,
          axisColor:"grey",
          axisAlpha:1,
          gridAlpha:2,
          gridColor:"white",
          gridThickness:1,
          labelFunction: function(value, valueText) {
            console.log('ahahahhaha', this)
            return `${vLabel} ${valueText}`
          }
        }
      ],

      graphs: [
        {
          id: "g1",
          balloonColor:"gray",
          balloonText:
            "<div style='font-size:14px; background-color:#fff;text-align:left'><span style='color:rgb(182,12,47); '>FUND RETURN [[value]]</span></div>",
          borderThickness:0,
          borderAlpha:0.1,
          lineColor: "rgb(182,12,47)",
          lineThickness: 1,
          useLineColorForBulletBorder: false,
          valueField: "value",
          bulletSize:13,
          showOnInit: false,
          startDuration: 0
        },
        {
          id: "g2",
          // bullet: "round",
          balloonColor:"gray",
          balloonText:
            "<div style='font-size:14px; background-color:#fff;text-align:left;padding-right:2px'><span style='color:rgb(106,157,154);'>BENCHMARK [[value1]]&nbsp;&nbsp;</span></div>",
          // bulletBorderAlpha: 1,
            // bulletBorderThickness:0,
          // bulletColor: "#a11c0d",
          lineColor: "rgb(106,157,154)",
          hideBulletsCount: 50,
          lineThickness: 1,
          valueField: "value1",
          showOnInit: false,
          startDuration: 0,
          pointRadius: 0
        },
         
      ],
        balloon:{
          adjustBorderColor:true,
          fillAlpha:1,
          borderAlpha:1,
          borderThickness:1,
          showBullet:true,
          drop:false,
          fillColor:"white",
          borderColor:"gray",
          shadowAlpha:0,
          fontSize:13,
          animationDuration: 0,
          startDuration: 0
           
        },

     chartCursor: {
        color:"white",
        cursorAlpha: 1,
        cursorColor:"rgb(163,11,42)",
        valueLineAlpha: 2,
        animationDuration: 0,
        startDuration: 0
      },
      categoryField: "month",
      categoryAxis: {
        gridAlpha:0,
        axisThickness:1,
        axisColor:"grey",
        axisAlpha:1,
        dashLength:4,
        parseDates: false,
        categoryFunction: function(category, dataItem, categoryAxis) {
          const m = getMonthNameByNum(dataItem.month.getMonth());
          return (
            "" +
            m +
            " " +
            dataItem.month.getDate() +
            ", " +
            dataItem.month.getFullYear()
          );
        },
        labelFunction: function(valueText, serialDataItem, categoryAxis) {
          return (
            "" + parseInt(serialDataItem.dataContext.month.getFullYear(), 10)
          );
        },
        showFirstLabel: false,
        startOnAxis: false,
        equalSpacing: true,
        autoGridCount: false,
        gridCount: 4
      },
      /*
	  categoryAxesSettings: {
		minPeriod: "yyyy",
		autoGridCount: false,
		equalSpacing: true,
		gridCount: 1000,
		labelRotation: 90, //recommended if you have a lot of labels
		axisHeight: 50  //recommended to avoid overlap with the scrollbar
	  },*/
      export: {
        enabled: true
      }
    };
  }
  ngOnInit() {
    // Create chartdiv1
    if (this.makeDataSet()) {
      this.options = this.makeOptions(this.makeDataSet());
      
      // Create chartdiv2
      this.chart2 = this.AmCharts.makeChart(
        "chartdiv2",
        this.makeOptions(this.makeDataSet())
        );
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    this.newData = this.makeDataSet();
    console.log(this.newData)
    if (this.newData) {
      this.options = this.makeOptions(this.makeDataSet());

      // Create chartdiv2
      this.chart2 = this.AmCharts.makeChart(
        "chartdiv2",
        this.makeOptions(this.makeDataSet())
      );
    }
  }
  ngOnDestroy() {
    if (this.chart2) {
      this.AmCharts.destroyChart(this.chart2);
    }
  }
}
