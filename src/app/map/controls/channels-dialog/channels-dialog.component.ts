import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// Dialog for channel sorter
@Component({
  selector: 'app-channels-dialog',
  templateUrl: './channels-dialog.component.html',
  styleUrls: ['./channels-dialog.component.scss']
})
export class ChannelsDialogComponent {
  channels;
  channelSorterOptions;
  activeChannels;
  constructor(
    public dialogRef: MatDialogRef<ChannelsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.channels = this.data.channels;
      this.channelSorterOptions = this.data.options;
      this.activeChannels = this.data.activeChannels;
    }


}
