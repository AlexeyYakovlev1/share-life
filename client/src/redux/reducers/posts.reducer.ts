import { IPost } from "../../models/post.models";
import { IPostAction } from "../../models/redux.models";

const initialState: Array<IPost> = [];

const SET_POSTS = "SET_POSTS";
const ADD_POST = "ADD_POST";
const REMOVE_POST = "REMOVE_POST";

function postsReducer(state = initialState, action: IPostAction) {
	switch (action.type) {
		case SET_POSTS:
			if (!Array.isArray(action.payload)) return;
			return [...action.payload];
		case ADD_POST:
			if (Array.isArray(action.payload)) return;
			return [action.payload, ...state];
		case REMOVE_POST:
			return state.filter((post: IPost) => +post.id !== +action.payload);
		default:
			return state;
	}
}

export default postsReducer;