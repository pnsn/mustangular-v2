// Gets parameters from URL

import { Injectable } from '@angular/core';
import { Subject ,  Observable , Subscription} from 'rxjs';
import { ActivatedRoute, Router} from '@angular/router';
import { Query } from '../query';
import { Display } from '../map/display';

@Injectable()
export class ParametersService {

  constructor (
    private route: ActivatedRoute,
    private router: Router
  ) {}

  private query = new Subject<Query>(); // Subscribeable query parameters
  private display: Display = new Display(); // Display information
  private start: string;
  private end: string;

  // Returns query parameters
  getQuery(): Observable<Query> {
    return this.query.asObservable();
  }

  // Returns display parameters
  getDisplay(): Display {
    return this.display;
  }

  updateUrl(changedDisplay: any): void {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: changedDisplay.toParams(),
        queryParamsHandling: 'merge',
      });
  }

  // Returns query start and end times
  getQueryDates(): any {
    return {
      'start': this.start,
      'end' : this.end
    };
  }

  // Sets display with url parameters
  setDisplay( params: any): void {
    const d = this.display;
    d.coloring = params.coloring;
    d.binning = {
      'count' : isNaN(+params.bincount) ? null : +params.bincount,
      'min' : isNaN(+params.binmin) ? null : +params.binmin,
      'max' : isNaN(+params.binmax) ? null : +params.binmax
    };
    d.invert = params.invert === 'true' ? true : false;
    d.displayValue = params.displayValue;
    d.aggregateValue = params.aggregateValue;
    d.colocatedType = params.colocatedType;
    d.channels.active = params.channels && params.channels.length > 1 ? params.channels.split() : params.channels;
    d.channels.available = params.cha ? params.cha.split() : null; // does this ever get used
    this.display = d;
  }

  // Grab query parameters from URL
  setQueryParameters(): void {
    const queryParamMap: Subscription = this.route.queryParamMap
      .subscribe(params => {
        if (params && params['params']) {
          const pa = params['params'];
          // grab other query params here

          const query = new Query(
            pa.net,
            pa.cha,
            pa.sta,
            pa.loc,
            pa.qual,
            pa.start,
            pa.end,
            pa.metric
          );
          this.start = query.start;
          this.end = query.end;

          this.setDisplay(pa);
          this.query.next(query);
        }
      });
      queryParamMap.unsubscribe();
  }

}
