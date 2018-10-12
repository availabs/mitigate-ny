const RECEIVE_COMMENTS = "RECEIVE_COMMENTS",
	NEW_MESSAGE = "NEW_MESSAGE",
	DELETE_MESSAGE = "DELETE_MESSAGE";

export const receiveComments = comments =>
	dispatch =>
		(dispatch({
			type: RECEIVE_COMMENTS,
			comments
		}),
		Promise.resolve())

const INITIAL_STATE = [];

export default (state=INITIAL_STATE, action) => {
	switch (action.type) {
		case RECEIVE_COMMENTS:
			return action.comments;
		default:
			return state;
	}
}