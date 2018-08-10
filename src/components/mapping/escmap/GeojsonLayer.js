import { GeoJsonLayer } from 'deck.gl';

const lightSettings = {
  lightsPosition: [-125, 50.5, 5000, -122.8, 48.5, 8000],
  ambientRatio: 0.2,
  diffuseRatio: 0.5,
  specularRatio: 0.3,
  lightsStrength: [1.0, 0.0, 2.0, 0.0],
  numberOfLights: 2
};

let UNIQUE_IDs = 0;
const getUniqueId = () => `geojson-layer-${ ++UNIQUE_IDs }`;

const DEFAULT_SETTINGS = {
  	opacity: 1,

  	stroked: true,
  	filled: true,

  	getLineColor: [0, 0, 0, 255],

  	lineWidthMinPixels: 1,
  	getFillColor: [0, 0, 0, 65],

    getRadius: 1,
    pointRadiusMinPixels: 5,

  	extruded: false,
  	getElevation: 0,
  	wireframe: false,

  	fp64: false,
  	pickable: true,
    lightSettings
}

export default class MyGeoJsonLayer extends GeoJsonLayer {
	constructor(args) {
		super({ ...DEFAULT_SETTINGS, ...args });
		this.id = args.id || getUniqueId();
	}
};