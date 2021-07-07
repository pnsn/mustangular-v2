// Describes a Display object

// {
//   data : {
//     max : number
//     min : number
//     count : number
//   },
//   coloring : {
//     low : color,
//     high : color
//   },
//   binning : {
//     min : number,
//     max : number,
//     count : number
//   },
//   displayValue : string,
//   aggregateValue: string,
//   channels : {
//     active : string array,
//     available : string array
//   }
// }

export class Display {
  data: any;
  coloring: string;
  binning: any;
  displayValue: string;
  aggregateValue: string;
  colocatedType: string;
  channels: any;
  invert: boolean;
  displayType: string; // Binary/Percent
  constructor() {

    // Data's max, min, and number of data points
    this.data = {
      'min' : null,
      'max': null,
      'count': 0
    };

    this.invert = false;

    // High and low color selections
    this.coloring = null;

    // Upper and lower bounds for bins and number of bins
    this.binning = {
      'min' : null,
      'max': null,
      'count': 0
    };

    // Type of display: channels or aggregate
    this.colocatedType = '';

    // Currently selected value to display for channels
    this.displayValue = '';

    // Currently selected value to display for stations
    this.aggregateValue = '';

    // Channels to display
    this.channels = {
      'active' : <string[]>  null,
      'available' : <string[]> null
    };
  }

  // Ensures there are values for binning
  private fixBins(): void {
    this.binning.min = this.binning.min === null ? 0 : this.binning.min;
    this.binning.max = this.binning.max === null ? 0 : this.binning.max;
    this.binning.count = this.binning.count === null || this.binning.count <= 0 ? 1 : this.binning.count;
  }

  // Returns a URL friendly string of the Display
  toString(): string {
    this.fixBins();
    const string =
      '&coloring=' + this.coloring +
      '&invert=' + this.invert +
      '&bincount=' + this.binning.count +
      '&binmin=' + this.binning.min +
      '&binmax=' + this.binning.max +
      '&displayValue=' + this.displayValue +
      '&colocatedType=' + this.colocatedType +
      '&aggregateValue=' + this.aggregateValue +
      '&channels=' + this.channels.active.toString();
    return  string ;
  }

  toParams(): any {
    this.fixBins();
    return {
      'coloring' : this.coloring,
      'invert' : this.invert,
      'bincount' : this.binning.count,
      'binmin' : this.binning.min,
      'binmax' : this.binning.max,
      'displayValue' : this.displayValue,
      'colocatedType' : this.colocatedType,
      'aggregateValue' : this.aggregateValue,
      'channels' : this.channels.active.toString()
    };
  }
}



