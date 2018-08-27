import { FlyToInterpolator } from 'react-map-gl';
import { fitBounds } from 'viewport-mercator-project';
import GeojsonExtent from '@mapbox/geojson-extent';
import { easeCubic } from 'd3-ease'

const DEFAULT_VIEWPORT_SETTINGS = {
    latitude: 42.924,
    longitude: -75.54,
    zoom: 6,
    maxZoom: 16,
    pitch: 0,
    bearing: 0,
    width: 500,
    height: 500,
    altitude: 1.5
}

export default (args={}) => {
	let viewport = {
			...DEFAULT_VIEWPORT_SETTINGS,
			...args
		},
		onChangeHandlers = [],
		transitioning = false,

		start, now,
		duration = 2000,
		from, to,
		property;

	function Viewport() {
		if (transitioning) {
            viewport.transitionInterpolator = new FlyToInterpolator();
            viewport.transitionEasing = easeCubic;
            viewport.transitionDuration = 2000;
			transitioning = false;
		}
		else {
			delete viewport.transitionInterpolator;
			delete viewport.transitionDuration;
			delete viewport.transitionEasing;
		}
		return viewport;
	}
	Viewport.onViewportChange = update => {
		viewport = {
			...viewport,
			...update
		}
		if (onChangeHandlers.length) {
			const update = { viewport: Viewport() };
			onChangeHandlers.forEach(({ owner, func, sendUpdate }) => sendUpdate ? func.call(owner, update) : func.call(owner));
		}
		return Viewport;
	}

	Viewport.transition = update => {
		transitioning = true;
		return Viewport.onViewportChange(update);
	}
	Viewport.ease = (prop, _to) => {
		start = Date.now();
		now = start;
		from = viewport[prop];
		to = _to;
		property = prop;
		window.requestAnimationFrame(doTransition);
		return Viewport;
	}

	Viewport.register = (owner, func, sendUpdate=true) => {
		Viewport.unregister(owner);
		onChangeHandlers.push({ owner, func, sendUpdate });
		return Viewport;
	}
	Viewport.unregister = _owner => {
		onChangeHandlers = onChangeHandlers.filter(({ owner }) => owner !== _owner);
		return Viewport;
	}

	Viewport.fitBounds = (bounds, options={ padding: 50 }) => {
		if (!bounds.length) return Viewport;
		transitioning = true;
		const opts = {
			width: viewport.width,
			height: viewport.height,
			bounds,
			...options
		}
		return Viewport.onViewportChange(fitBounds(opts));
	}
	Viewport.fitGeojson = (geojson, options={ padding: 50 }) =>
		Viewport.fitBounds(getGeojsonBounds(geojson), options);

	const doTransition = viewport => {
		now = Date.now();
		const time = (now - start) / duration,
			ease = easeCubic(time);
		let value = from + (to - from) * ease;
		if (to < from) {
			value = Math.max(to, value);
		}
		else {
			value = Math.min(to, value);
		}
		Viewport.onViewportChange({ [property]: value });
		if (ease < 1.0) {
			window.requestAnimationFrame(doTransition);
		}
	}

	return Viewport;
}

const getGeojsonBounds = geojson => {
	if (!geojson) return [];
	if (!geojson.type) return [];
	if ((geojson.type === "FeatureCollection") &&
		!geojson.features.length) {
		return [];
	}
	const extent = GeojsonExtent(geojson);
	if (!extent) return [];
	return [extent.slice(0, 2), extent.slice(2)];
}