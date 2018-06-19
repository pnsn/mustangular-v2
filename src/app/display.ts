export class Display {
  data : any;
  coloring : any;
  binning : any;
  displayValue : string;
  channels: any;
  
  constructor(){
    this.data = { 
      "min" : null,
      "max": null,
      "count": 0
    };
    
    this.coloring = {
      "low" : null,
      "high" : null
    };
    
    this.binning = {
      "min" : null, 
      "max": null, 
      "count": 0
    };
    
    this.displayValue = "";  
    
    this.channels = {
      "active" : null,
      "available" : null
    };
  }

}

