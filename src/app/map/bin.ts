export class Bin {

  constructor (
    public count: number,
    public color: string,
    public position: number,
    public layer: string,
    public max?: number,
    public min?: number,
    public width?: number
  ) {}

  // Width of bid for histogram
  setWidth(count: number): void {
   this.width = 85 * this.count / count;
  }

  // Returns if value falls in bin
  inBin(value: number, index: number, count: number): boolean {
    if(count - 1 === index) { //no data
      return value !== 0 && !value || value === null;
    } else if(count - 2 === index) { //2nd to last bin for > than range
      return value > this.min && value <= this.max;
    } else if (count - 3 === index){ //3rd to last bin is inclusive
      return value >= this.min && value <= this.max;
    } else {
      return value >= this.min && value < this.max;
    }
  }

}
