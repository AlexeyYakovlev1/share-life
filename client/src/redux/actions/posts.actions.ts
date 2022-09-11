import { IPost } from "../../models/post.models";
import { IPostAction, IPostRemoveAction } from "../../models/redux.models";

export function setPosts(posts: Array<IPost>): IPostAction {
	return {
		type: "SET_POSTS",
		payload: posts
	};
}

export function addPost(post: IPost): IPostAction {
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