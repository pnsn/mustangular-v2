// Generates station graphs

import { Component, OnInit , Inject, OnDestroy} from '@angular/core';
import { MakeMarkersService } from '../../../shared/make-markers.service';
import { DataService} from '../../../shared/data.service';
import { Station } from '../../station';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Metric } from '../../metric';
import { Subscription } from 'rxjs';
import { ParametersService } from '../../../shared/parameters.service';

@Component({
  selector: 'app-station',
  template: ''
})

export class StationComponent implements OnInit, OnDestroy {

  constructor(
    private makeMarkersService: MakeMarkersService,
    private dataService: DataService,
    public dialog: MatDialog,
    public parametersService: ParametersService
  ) {}

  activeStation: Station; // Selected station
  metrics: Metric[]; // Copy of all metric data
  activeMetric: Metric; // Currently active metric
  subscription: Subscription = new Subscription(); // Handles connections
  dates: any;

  ngOnInit() {
    // Get station when it is selected
    const sub = this.makeMarkersService.getActiveStation().subscribe(
      activeStation => {
        if (activeStation) {
          this.activeStation = activeStation;
          this.dates = this.parametersService.getQueryDates();
          this.openStationDialog();

        }
      }
    );

    this.subscription.add(sub);

    // Get currently selected metric
    const sub1 = this.dataService.getActiveMetric().subscribe(
      activeMetric => {
        this.activeMetric = Object.assign(activeMetric);
        this.metrics = this.dataService.getMetrics();
      }
    );

    this.subscription.add(sub1);
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
  }

  // Formats data for chart
  convertDataToChart(station: Station): any {
    const results = [];
    for (const c in station.channels) {
      if (station.channels[c]) {
        const chan = station.channels[c];

        const ch = {
          name: chan.name,
          series: []
        };

        for (const m of chan.measurements) {
          const date = new Date(m.start + 'Z');
          // adjusts for browsers wanting to use local time
          const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
          ch.series.push({
            value: m.value,
            name: adjustedDate
          });
        }
        results.push(ch);
      }
    }
    return results;
  }


  // Opens dialog to sort channels
  openStationDialog(): void {
    const results = this.convertDataToChart(this.activeStation);
    const dialogRef = this.dialog.open(StationDialogComponent, {
      data: {
        station: this.activeStation,
        metric: this.activeMetric,
        values: results,
        start: this.dates.start,
        end: this.dates.end
      },
      width: '80%',
      height: '60%'
    });
  }
}

// Dialog for channel sorter
@Component({
  selector: 'app-station-dialog',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss']
})

export class StationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<StationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    station = this.data.station;
    metric = this.data.metric;

    xAxisLabel = 'Measurement Start Date';
    yAxisLabel = this.metric.unit;

    legendTitle = 'Click to view PSD-PDF';

    colorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    results = this.data.values;

    select(event): void {
      if (typeof event === 'string' || event instanceof String) {
        const url = 'https://service.iris.edu/mustang/noise-pdf/1/query?target=';
        window.open(url + this.station.code + '.' + event + '.' + this.station.qual +
        '&starttime=' + this.data.start + '&endtime=' + this.data.end + '&format=plot');
      }
    }
}
