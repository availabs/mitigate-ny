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
const DEFAULT_FIT_OPTIONS = { padding: 50 };

const Ease = ({ ...args }) => ({
	start: Date.now(),
	...args
})

export default (args={}) => {
	let viewport = {
			...DEFAULT_VIEWPORT_SETTINGS,
			...args
		},
		onChangeHandlers = [],
		transitioning = false,

		intervals = {};

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
	Viewport.ease = (prop, to, { duration=2000, easeFunc=easeCubic, onTransitionEnd=null }={}) => {
		const from = viewport[prop];
		if (prop in intervals) {
			clearInterval(intervals[prop]);
		}
		intervals[prop] = setInterval(doEase, 50, Ease({ prop, from, to, duration, easeFunc, onTransitionEnd }));
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

	Viewport.fitBounds = (bounds, options=DEFAULT_FIT_OPTIONS) => {
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
	Viewport.fitGeojson = (geojson, options=DEFAULT_FIT_OPTIONS) =>
		Viewport.fitBounds(getGeojsonBounds(geojson), options);

	const doEase = ({ prop, from, to, start, duration, easeFunc, onTransitionEnd }) => {
		const  now = Date.now(),
			time = (now - start) / duration,
			ease = easeFunc(time);

		let value = from + (to - from) * ease;
		if (to < from) {
			value = Math.max(to, value);
		}
		else {
			value = Math.min(to, value);
		}
		Viewport.onViewportChange({ [prop]: value });

		if (ease >= 1.0) {
			clearInterval(intervals[prop]);
			delete intervals[prop];
			if (onTransitionEnd) {
				onTransitionEnd();
			}
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