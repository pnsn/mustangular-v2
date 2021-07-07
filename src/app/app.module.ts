// This is an Angular thing that tells the apps what to import

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppComponent } from './app.component';
import 'hammerjs';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClientJsonpModule} from '@angular/common/http';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MapComponent } from './map/map.component';
import { FormComponent } from './form/form.component';
import { StationComponent , StationDialogComponent} from './map/markers/station/station.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MakeMarkersService } from './shared/make-markers.service';
import { BinningService } from './shared/binning.service';
import { ParametersService } from './shared/parameters.service';
import { DataService } from './shared/data.service';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSliderModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { SortablejsModule } from 'angular-sortablejs';
import { MarkersComponent } from './map/markers/markers.component';
import { ControlsComponent} from './map/controls/controls.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ColorPickerModule} from 'ngx-color-picker';
import { KeyComponent } from './map/controls/key/key.component';
import { ButtonsComponent, DownloadDialogComponent, HelpDialogComponent} from './map/controls/buttons/buttons.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ColoringComponent } from './map/controls/coloring/coloring.component';
import { RemoveUnderscorePipe } from './remove-underscore.pipe';
import { LoadingComponent } from './map/loading/loading.component';
import { StationsService } from './shared/stations.service';
import { ChannelsDialogComponent } from './map/controls/channels-dialog/channels-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    FormComponent,
    StationComponent,
    MarkersComponent,
    ControlsComponent,
    ChannelsDialogComponent,
    DownloadDialogComponent,
    StationDialogComponent,
    HelpDialogComponent,
    KeyComponent,
    ButtonsComponent,
    ColoringComponent,
    RemoveUnderscorePipe,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LeafletModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatMomentDateModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
    FlexLayoutModule,
    AngularFontAwesomeModule,
    ColorPickerModule,
    NgxChartsModule,
    NoopAnimationsModule,
    SortablejsModule.forRoot({ animation: 150 })
  ],
  providers: [
    MakeMarkersService,
    BinningService,
    StationsService,
    DataService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  entryComponents: [ChannelsDialogComponent, DownloadDialogComponent, StationDialogComponent, HelpDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
