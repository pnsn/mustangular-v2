import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
import { Query } from './query';
import { Display } from './display'

@Injectable()
export class ParametersService {

  //fake initial values here

  constructor(private route:ActivatedRoute, private location : Location){}
  
  private query = new Subject<Query>();

  getQuery() : Observable<Query> {
    return this.query.asObservable();
  }
  
  private display : Display = new Display();
  
  
  getDisplay() : any { //TODO: deal with these values from URL.
    console.log("getDisply", this.display)
    return this.display;
  }
  
  setDisplay( params  : any) : void{
    let d = this.display;
    console.log(params)
    d.coloring = {
      "high" : params.high,
      "low" : params.low
    };
    d.binning = {
      "count" : params.count,
      "min" : params.min,
      "max" : params.max
    };
    d.displayValue = params.value; 
    d.channels.active = params.channels; 
    
    this.display = d;
    
  }
  //TODO: sanitize
  
  setQueryParameters() : void {
    this.route.queryParamMap
      .subscribe(params => {
        if(params && params["params"]){
          var pa = params["params"];
          //grab other query params here
          
          if(pa.cha) {
            this.display.channels.available = pa.cha.split(",");
          }
          console.log("params", pa)
          let query = new Query(
            pa.net,
            pa.cha,
            pa.sta,
            pa.loc,
            pa.qual,
            pa.start,
            pa.end,
            pa.metric
          );
          this.setDisplay(pa);
          query.sanitize();
          this.query.next(query);
        }
      });
  }

}
