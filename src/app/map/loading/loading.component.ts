import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  @Input() status: {
    message: string;
    error: boolean;
    info?: string;
  };
  timeout;
  showError = false;
  constructor() {}

  ngOnInit() {
    this.timeout = setTimeout(() => {
      if (!this.status.error) {
        this.status.info =
          'Large requests may take several minutes to load. To reduce load times,' +
          'try smaller date ranges, less metrics, or more specific queries.';
        this.showError = true;
      }
    }, 1000 * 15); // after 20 seconds tell them requests take a while
  }
}
