// Handles dialogs and logic for downloading, help text, and sharing

import { Component, OnInit , Input, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { Metric } from '../../metric';
import { MeasurementsService } from '../../../shared/measurements.service';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {
  @Input() metric: Metric; // Gets metric from parent component

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public measurementsService: MeasurementsService) {
  }

  ngOnInit() {
  }

  // Copies share metric link to clipboard
  copyShareLink(): void {
    // This is from stackoverflow
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = window.location.href.replace(/metric=.+(&|$)/, 'metric=' + this.metric.name) + this.metric.display.toString();
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    // Open copy link snackbar
    this.snackBar.open('Link copied to clipboard!', '', {
      duration: 3000
    });
  }

  // Opens dialog to select download type
  openDownloadDialog(): void {
    const dialogRef = this.dialog.open(DownloadDialogComponent, {
      data: {url: 'test'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Open download snackbar
        window.open(this.measurementsService.getUrl() + '&output=' + result);
        this.snackBar.open('Opened ' + result + 'in new tab.', '', {
          duration: 3000
        });
      }
    });
  }

  // Opens help dialog
  openHelpDialog(): void {
    const dialogRef = this.dialog.open(HelpDialogComponent, {
      data: {url: 'test'}
    });
  }
}


// Dialog for download type selector
@Component({
  selector: 'app-download-dialog',
  templateUrl: './download-dialog.html',
  styleUrls: ['./buttons.component.scss']
})
export class DownloadDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DownloadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    types = ['xml', 'csv', 'text', 'json'];
}


// Dialog for help information
@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.html',
  styleUrls: ['./buttons.component.scss']
})
export class HelpDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<HelpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

}
