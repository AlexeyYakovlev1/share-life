import { IPostAction, IPostRemoveAction } from "../../models/redux.models";
import { IFullPost } from "../reducers/posts.reducer";

export function setPosts(posts: Array<IFullPost>): IPostAction {
	return {
		type: "SET_POSTS",
		payload: posts
	};
}

export function addPost(post: IFullPost): IPostAction {
	return {
		type: "ADD_POST",
		payload: post
	};
}

export function removePost(postId: number): IPostRemoveAction {
	return {
		type: "REMOVE_POST",
		payload: postId
	};
}