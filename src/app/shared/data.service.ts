import { Injectable } from '@angular/core';
import { Metric } from '../map/metric';
import { Subject ,  Observable } from 'rxjs';
@Injectable()
export class DataService {

  constructor() { }

  private parameters: any;
  private metrics: Metric[];
  private activeMetric = new Subject<Metric>();
  private metricNames: string[] = [];

  setDisplay(parameters: any): void {
    this.parameters = parameters;
  }

  getActiveMetric(): Observable<Metric> {
    return this.activeMetric.asObservable();
  }

  // Changes the active metric and propagates it
  private setActiveMetric(activeMetricName: String): void {
    for (const metric of this.metrics) {
      if (metric.name === activeMetricName ) {
        metric.updateValues();
        this.activeMetric.next(metric);
      }
    }

  }

  getMetrics(): Metric[] {
    return Object.assign(this.metrics);
  }

  updateMetrics(metrics: Metric[], activeMetricName: string): void {
    this.metrics = metrics;
    this.setActiveMetric(activeMetricName);
  }

  // only happens once
  setMetrics(metrics: Metric[]): void {
    this.metrics = metrics;
    this.calculateValues();
  }

  // Calculates 5th and 95th percentile of data
  // gets weird when there's only a few values
  private initialBinning(values: number[], displayType?: string): any {
    const length = values.length;
    let minIndex: number;
    let maxIndex: number;
    let max, min, count: number;

    // Find max and min values - default to %iles unless specified
    switch (displayType) {
      case 'percent' :
        min = 0;
        max = 100;
        count = 5;
        break;
      case 'boolean':
        min = 0;
        max = 1;
        count = 2;
        break;
      case 'polarity' :
        min = -1;
        max = 1;
        count = 2;
        break;
      default:
        minIndex = Math.ceil(.05 * length) - 1;
        maxIndex = Math.floor(0.95 * length);
        min = length > 0 && values[minIndex] ? +values[minIndex].toFixed(2) : 0;
        max = length > 0 && values[maxIndex] ? +values[maxIndex].toFixed(2) : 1;

        if (length === 0 || minIndex === maxIndex ) { // small dataset
          count = 1;
        } else if (values[maxIndex] - values[minIndex] < 2) { // range
          count = 2;
        } else {
          count = 3;
        }
        break;
    }

    return {
        'max' : max,
        'min' : min,
        'count' : count
    };
  }

  private sortChannels(channels: Array <string>): Array <string> {
    if (channels.length > 0) {
      const displayChannels = [];
      for ( const channel of channels) {
        if (displayChannels.indexOf(channel) === -1 ) {
          displayChannels.push(channel);
        }
      }
      return displayChannels;
    } else {
      return channels;
    }
  }

  // Apply default value, parameter values or calculate new ones.
  private calculateValues (): void {
    let defaultMetric = null;
    for (const metric of this.metrics) {
      const display = metric.display;

      if (this.metricNames.indexOf(metric.name) < 0) {
        this.metricNames.push(metric.name);
      }

      if (this.parameters.displayValue) {
        display.displayValue = this.parameters.displayValue;
      } else {
        display.displayValue = 'Average';
      }

      if (this.parameters.colocatedType) {
        display.colocatedType = this.parameters.colocatedType;
      } else {
        display.colocatedType = 'channel';
      }

      if (this.parameters.aggregateValue) {
        display.aggregateValue = this.parameters.aggregateValue;
      } else if (display.colocatedType = 'aggregate') {
        display.aggregateValue = 'Minimum';
      }

      display.invert = this.parameters.invert ? this.parameters.invert : false;

      display.channels.available = this.sortChannels(metric.getChannels());

      metric.updateValues();

      const values = metric.getValues();

      if (this.parameters.coloring) {
        display.coloring = this.parameters.coloring;
      } else {
        display.coloring = 'red_to_green';
      }

      if (this.parameters.binning &&
          this.parameters.binning.max !== null &&
          this.parameters.binning.min !== null &&
          this.parameters.binning.count !== null) {
        display.binning = this.parameters.binning;
      } else {
        display.binning = this.initialBinning(values, display.displayType);
      }

      metric.display = display;

      if (defaultMetric === null && metric.display.data.count > 0) {
        defaultMetric = metric;
      }

    }
    if (defaultMetric) {
      this.activeMetric.next(defaultMetric);
    }

  }
}
