import { IPost, IComment } from "../../models/post.models";
import { IPostAction } from "../../models/redux.models";

export interface IFullPost extends IPost { comments: Array<IComment>; }

const initialState: Array<IFullPost> = [];

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
			return [...state, action.payload];
		case REMOVE_POST:
			return state.filter((post: IFullPost) => +post.id !== +action.payload);
		default:
			return initialState;
	}
}

export default postsReducer;