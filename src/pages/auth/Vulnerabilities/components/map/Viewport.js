import { FlyToInterpolator } from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';
import GeojsonExtent from '@mapbox/geojson-extent';
import { easeCubic } from 'd3-ease'

export default () => {
	let mercator = new WebMercatorViewport({
	        latitude: 42.924,
	        longitude: -75.54,
	        zoom: 6,
	        maxZoom: 16,
	        pitch: 0,
	        bearing: 0,
	        width: 500,
	        height: 500
		}),
		onChange = null,
		transitioning = false;

	function Viewport() {
		const viewport = {
			latitude: mercator.latitude,
			longitude: mercator.longitude,
			zoom: mercator.zoom,
			maxZoom: mercator.maxZoom,
			pitch: mercator.pitch,
			bearing: mercator.bearing,
			width: mercator.width,
			height: mercator.height
		};
		if (transitioning) {
            viewport.transitionDuration = 2000;
            viewport.transitionInterpolator = new FlyToInterpolator();
            viewport.transitionEasing = easeCubic;
			transitioning = false;
		}
		return viewport;
	}
	Viewport.onViewportChange = viewport => {
		mercator = new WebMercatorViewport({
			...Viewport(),
			...viewport
		})
		if (onChange) onChange({ viewport: Viewport() });
		return Viewport;
	}
	Viewport.onChange = func => {
		onChange = func;
		return Viewport;
	}
	Viewport.fitBounds = (bounds, options={ padding: 50 }) => {
		if (!bounds.length) return Viewport;
		mercator = mercator.fitBounds(bounds, options);
		transitioning = true;
		if (onChange) onChange({ viewport: Viewport() });
		return Viewport;
	}
	Viewport.fitGeojson = geojson =>
		Viewport.fitBounds(getGeojsonBounds(geojson));

	return Viewport;
}

const getGeojsonBounds = geojson => {
	const extent = GeojsonExtent(geojson);
	if (!extent) return [];
	return [extent.slice(0, 2), extent.slice(2)];
}