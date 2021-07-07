// Describes a Channel object

// {
//   name : string,
//   measurements : Measurement array
// }

import { Measurement } from './measurement';
export class Channel {

  constructor (
    public name: string,
    public loc = '',
    public cha = ''
  ) {

    this.measurements = new Array<Measurement>();
  }
  public measurements: Measurement[];
  private values: Array<number>; // Channel's possible values
  private median?: number; // Median channel value
  private average?: number; // Average channel value
  private max?: number; // Maximum channel value
  private min?: number; // Minimum channel value
  // Calculates the values for the channel
  private calculateValues(): void {
    if ( !this.values || this.values.length === 0 ) {
      const values = [];

      for (const measurement of this.measurements) {
        values.push(+measurement.value);
      }

      values.sort(function(a, b) {return a - b; });
      this.values = values;
      this.max = values[values.length - 1];
      this.min = values[0];
    }
  }

  // returns the value for the given display option
  getValue(displayValue: string): number {
    let value: number;

    this.calculateValues();

    switch (displayValue) {
      case 'Minimum' : {
        value = this.getMin();
        break;
      }
      case 'Maximum' : {
        value = this.getMax();
        break;
      }
      case 'Average' : {
        value = this.getAverage();
        break;
      }
      case 'Median' : {
        value = this.getMedian();
        break;
      }
      case '5th_Percentile' : {
        value = this.getPercentile(5);
        break;
      }
      case '95th_Percentile' : {
        value = this.getPercentile(95);
        break;
      }
      default : {
        value = null;
        break;
      }
    }
    return value;
  }

  // Calculates the median for the channel
  private getMedian(): number {
    if ( !this.median ) {
      const mid = this.values.length / 2 - 0.5;
      let median: number;

      if (mid % 1 === 0) {
        median = this.values[mid];
      } else {
        median = (this.values[mid - .5] + this.values[mid - .5]) / 2;
      }

      this.median = median;
    }
    return this.median;
  }

  // Calculates the average value for the channel
  private getAverage(): number {
    if ( !this.average ) {
      let sum = 0;
      for (const value of this.values) {
        sum += value;
      }
      const average = sum / this.values.length;
      this.average = average;

    }
    return this.average;
  }

  // Returns requested percentile, probably
  private getPercentile(percentile: number): number {
    const index = Math.ceil(percentile / 100 * this.values.length);
    return index === this.values.length ? this.values[index - 1] : this.values[index];
  }

  // Returns the channel's maximum value
  private getMax(): number {
    return this.max;
  }

  // Returns the channel's minimum value
  private getMin(): number {
    return this.min;
  }

}
