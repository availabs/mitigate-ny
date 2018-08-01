const SEND_SYSTEM_MESSAGE = "SEND_SYSTEM_MESSAGE",
	DISMISS_SYSTEM_MESSAGE = "DISMISS_SYSTEM_MESSAGE";

let UNIQUE_ID = 0;
const getUniqueId = () =>
	`system-message-${ ++UNIQUE_ID }`;

const getMessageOptions = options => {
	if (!options.id) options.id = getUniqueId();
	return options;
}
const DEFAULT_MESSAGE_OPTIONS = {
	duration: 10000
}

export const sendSystemMessage = (message, options={}) =>
	dispatch =>
		(dispatch({
			type: SEND_SYSTEM_MESSAGE,
			message,
			options: getMessageOptions({ ...DEFAULT_MESSAGE_OPTIONS, ...options })
		}),
		Promise.resolve())

export const dismissSystemMessage = id =>
	dispatch =>
		(dispatch({
			type: DISMISS_SYSTEM_MESSAGE,
			id
		}),
		Promise.resolve())

export default (state=[], action) => {
	switch (action.type) {
		case SEND_SYSTEM_MESSAGE: {
			let newState = newState.filter(({ id }) => id != action.options.id);
			newState.push({ message: action.message, ...action.options });
			return newState;
		};
		case DISMISS_SYSTEM_MESSAGE: {
			let newState = newState.filter(({ id }) => id != action.id);
			return newState;
		};
		default:
			return state;
	}
}