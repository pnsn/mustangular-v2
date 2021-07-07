// Generates bins to color map icons

import { Bin } from '../map/bin';
import * as Rainbow from 'rainbowvis.js';
import { Subject ,  Observable } from 'rxjs';

export class BinningService {

    constructor() {}
    private colorings: any[] = [
    {
      name: 'rainbow',
      title: 'Rainbow',
      colors: ['purple', 'blue', 'cyan', 'green', 'yellow', 'orange', 'red'],
      outliers: ['black', 'gray', 'white']
    },
    {
      name: 'jet',
      title: 'Jet',
      colors: ['blue', 'cyan', 'white', 'yellow', 'red'],
      outliers: ['black', 'gray', 'silver']
    },
    {
      name: 'polar',
      title: 'Polar',
      colors: ['blue', 'white', 'red'],
      outliers: ['black', 'gray', 'white']
    },
    {
      name: 'hot',
      title: 'Hot',
      colors: ['black', 'red', 'orange', 'yellow', 'white'],
    outliers: ['blue', 'green', 'silver']
    },
    {
      name: 'red_to_green',
      title: 'Red to Green',
      colors: ['red', 'white', 'green'],
      outliers: ['black', 'gray', 'silver']
    },
    {
      name: 'ocean',
      title: 'Ocean',
      colors: ['black', 'blue', 'cyan', 'white'],
      outliers: ['red', 'gray', 'silver']
    },
    {
      name: 'cool',
      title: 'Cool',
      colors: ['cyan', 'blue', 'purple'],
      outliers: ['black', 'gray', 'white']
    },
    {
      name: 'split',
      title: 'Split',
      colors: ['blue', 'black', 'red'],
      outliers: ['gray', 'silver', 'white']
    },
    {
      name: 'gray',
      title: 'Gray',
      colors: ['black', 'gray', 'white'],
      outliers: ['blue', 'green', 'red']
    },
    {
      name: 'seis',
      title: 'Seis',
      colors: ['red', 'orange', 'yellow', 'green', 'blue'],
      outliers: ['black', 'gray', 'white']
    }];

    private bins = new Subject<Bin[]>(); // Subscribeable bins
    private activeLayers = new Subject<any>(); // Subscribeable layer statuses

    // Returns the status of the layers
    getActiveLayers(): Observable<any> {
      return this.activeLayers.asObservable();
    }

    // Sets the layers
    setActiveLayers(layers): void {
      this.activeLayers.next(layers);
    }

    // Returns the bins
    getBins(): Observable<Bin[]> {
      return this.bins.asObservable();
    }

    // Sets the bins
    setBins(bins: Bin[]): void {
      this.bins.next(bins);
    }

    getColorings(): any[] {
      return this.colorings;
    }

    // Creates the bins
    makeBins(display: any): Bin[] {
      const binning = display.binning;
      const data = display.data;

      let coloring: any;
      for (const c of this.colorings) {
        if (c.name === display.coloring) {
          coloring = c;
        }
      }
      if (!coloring) {
        coloring = this.colorings[0];
      }

      // reference self's coloring
      const bins = new Array < Bin > ();
      const rainbow = new Rainbow();
      const binWidth = Math.round((binning.max - binning.min) * 100 / binning.count) / 100;
      let min = Math.round(binning.min * 100) / 100;

      // Low outliers
      bins.push(new Bin( 0, coloring.outliers[0], -1, 'icon-group-0', min, data.min));

      // Middle bins
      rainbow.setNumberRange(0, binning.count > 1 ? binning.count - 1 : 1);

      if (display.invert) {
        rainbow.setSpectrumByArray(coloring.colors.slice().reverse());
      } else {
        rainbow.setSpectrumByArray(coloring.colors);
      }

      let max; // if its the last bin, make it position 0.5
      for (let i = 0; i < binning.count; i++) {
          max = Math.round((min + binWidth) * 100) / 100;
          if ( i === binning.count - 1 ) {
            bins.push( new Bin (0, '#' + rainbow.colorAt(i), 0.5,  'icon-group-' + (i + 1), max, min));
          } else {
            bins.push( new Bin (0, '#' + rainbow.colorAt(i), 0,  'icon-group-' + (i + 1), max, min));
          }

          min = max;
      }

      // High outlier
      bins.push( new Bin (0, coloring.outliers[1], 1, 'icon-group-' + (binning.count + 1), data.max, max));

      // No data
      bins.push( new Bin (0, coloring.outliers[2], 2, 'no-data-' + (binning.count + 2), 0 , 0));

      return bins;
    }
}
