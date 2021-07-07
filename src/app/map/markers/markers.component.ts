// Generates the leaflet map and the markers on it
import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { latLngBounds, tileLayer, Map } from 'leaflet';
import { Metric } from '../metric';
import { MakeMarkersService } from '../../shared/make-markers.service';
import { DataService } from '../../shared/data.service';
import { BinningService } from '../../shared/binning.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styleUrls: ['./markers.component.scss'],
})
export class MarkersComponent implements OnInit, OnDestroy {
  constructor(
    private makeMarkersService: MakeMarkersService,
    private dataService: DataService,
    private binningService: BinningService,
    private elementRef: ElementRef
  ) {}

  subscription: Subscription = new Subscription(); // Used to close connections
  activeMetric: Metric; // Currently viewed metric
  overlays: any; // Active layers
  overlayMaster: any; // All available layers
  fitBounds: any; // Bounds to zoom map to
  layers: any = {}; // Layer statuses

  baseLayer = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'OSM',
  });
  // Leaflet map options
  options = {
    zoomSnap: 0.5,
    zoomDelta: 0.5,
    layers: [this.baseLayer],
    preferCanvas: true,
  };

  layersControl = {
    baseLayers: {
      'Street Map': this.baseLayer,
      'Black and White': tileLayer(
        'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
        { maxZoom: 18, attribution: 'OpenStreetMap' }
      ),
      'World Topo': tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 18,
          attribution:
            'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
        }
      ),
      'World Imagery': tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 18,
          attribution:
            'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        }
      ),
    },
  };

  ngOnInit() {
    // Wait for active metric
    const sub = this.dataService.getActiveMetric().subscribe((activeMetric) => {
      if (activeMetric) {
        this.activeMetric = activeMetric;
        this.makeMarkers();
      }
    });
    this.subscription.add(sub);

    // Add or remove layers from the map when the layers are toggled
    const sub1 = this.binningService.getActiveLayers().subscribe((layers) => {
      this.layers = layers;
      this.overlays = [];
      for (const layer in this.layers) {
        if (this.layers[layer]) {
          const index = +layer.match(/\d+$/);
          if (this.overlayMaster[index]) {
            this.overlays.push(this.overlayMaster[index]);
          }
        }
      }
    });
    this.subscription.add(sub1);
  }

  // Close connections when navigating away
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onMapReady(map: Map) {}

  // Make the markers for the map
  private makeMarkers(): void {
    // Get the bins
    const bins = this.binningService.makeBins(this.activeMetric.display);

    if (this.activeMetric && bins) {
      // Make markers and recieve the overlays containing markers
      this.overlayMaster = this.makeMarkersService.makeMarkers(
        this.activeMetric,
        bins
      );

      // Update master bins with new bins.
      this.binningService.setBins(this.makeMarkersService.getBins());

      // Initiate layers statuses
      for (const bin of bins) {
        if (bin.count > 0) {
          this.layers[bin.layer] = true;
        }
      }

      // Update layer statuses
      this.binningService.setActiveLayers(this.layers);

      // Zoom map to fit the bounds
      if (this.makeMarkersService.getLatLons().length > 0 && !this.fitBounds) {
        this.fitBounds = latLngBounds(this.makeMarkersService.getLatLons());
        // check if map has center
        this.fitBounds.options = { padding: [400, 400] };
      }
    }
  }
}
