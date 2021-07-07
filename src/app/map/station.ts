// Describes a Station object
// {
//   net: string,
//   sta: string,
//   lat: number,
//   lon: number,
//   name: string,
//   loc: string,
//   code: string, //NET.STA.LOC
//   channels: any
// }

import { Channel } from './channel';

export class Station {

    constructor (
      public net: string,
      public sta: string,
      public code: string,
      public qual: string
    ) {
      this.displayValue = null;
      this.displayChannel = null;
    }
    lat: number;
    lon: number;
    name: string;
    channels: any = {};
    displayValue: number; // Value displayed for the station
    displayChannel: string; // Channel being used to display

    // Sorts channels to group up by loc and channel type
    private sortChannels(): any {
      this.channels = Object.keys(this.channels)
        .sort(function(a: any, b: any) {
          const A = a.split('.');
          const B = b.split('.');

          if (A[0] === '--') {
            A[0] = -1;
          }

          if (B[0] === '--') {
            B[0] = -1;
          }

          if (parseInt(A[0], 10) < parseInt(B[0], 10)) {
            return -1;
          } else if (parseInt(A[0], 10) > parseInt(B[0], 10)) {
            return 1;
          } else {
            if (A[1] < B[1]) {
              return -1;
            } else if (A[1] > B[1]) {
              return 1;
            } else {
              return 0;
            }
          }
        })
       .reduce((_sortedObj, key) => ({
         ..._sortedObj,
         [key]: this.channels[key]
       }), {});
     }

    // Finds the single display value for the station from all the channels
    private getValueFromDisplayChannel(displayValue: string, displayChannels: string[], setDisplay: boolean) {
      this.displayChannel = null;
      for (const displayChannel of displayChannels ) {
        if ( !this.displayChannel) {
          for (const c in this.channels) {
            if (this.channels[c]) {
              const channel = this.channels[c];
              if (channel.name === displayChannel) {
                this.displayChannel = channel.name;
                if ( setDisplay ) {
                  this.displayValue = channel.getValue(displayValue);
                }
              }
            }
          }
        }

      }
    }

    // Calculates the given aggregate value for the station
    private getValueFromAggregate(displayValue: string, aggregateValue: string) {
      const channelValues = [];
      for (const c in this.channels) {
        if (this.channels[c]) {
          const channel = this.channels[c];
          channelValues.push(channel.getValue(displayValue));
        }
      }

      switch (aggregateValue) {
        case 'Minimum' : {
          this.displayValue = Math.min(...channelValues);
          break;
        }
        case 'Maximum' : {
          this.displayValue = Math.max(...channelValues);
          break;
        }
        case 'Most_Extreme' : {
          const min = Math.min(...channelValues);
          const max = Math.max(...channelValues);

          this.displayValue = Math.abs(min) > Math.abs(max) ? min : max;
          break;
        }
        default : {
          this.displayValue = null;
          break;
        }
      }
    }

    // Sets the station value according to the display value and selected channels
    setValue(colocatedType:string, displayValue: string, aggregateValue: string, displayChannels: string[]): void {
      this.sortChannels();

      if ( colocatedType && colocatedType === 'aggregate' ) {
        this.getValueFromAggregate(displayValue, aggregateValue);
        this.getValueFromDisplayChannel(displayValue, displayChannels, false);
      } else {
        this.getValueFromDisplayChannel(displayValue, displayChannels, true);
      }
    }
}
