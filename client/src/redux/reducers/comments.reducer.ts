import { IComment } from "../../models/post.models";
import { ICommentsAction } from "../../models/redux.models";

const initialState: Array<IComment> = [];

const SET_COMMENTS = "SET_COMMENTS";
const ADD_COMMENT = "ADD_COMMENT";
const REMOVE_COMMENT = "REMOVE_COMMENT";

function commentsReducer(state = initialState, action: ICommentsAction) {
	switch (action.type) {
		case SET_COMMENTS:
			if (!Array.isArray(action.payload)) return;
			return [...action.payload];
		case ADD_COMMENT:
			if (Array.isArray(action.payload)) return;
			return [...state, action.payload];
		case REMOVE_COMMENT:
			if (typeof action.payload !== "number") return;
			return state.filter((comment: IComment) => +comment.id !== +action.payload);
		default:
			return initialState;
	}
}

export default commentsReducer;