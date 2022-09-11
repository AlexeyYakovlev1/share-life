import { IComment } from "../../models/post.models";
import { ICommentsAction, ICommentsRemoveAction } from "../../models/redux.models";

export function setComments(comments: Array<IComment>): ICommentsAction {
	return {
		type: "SET_COMMENTS",
		payload: comments
	};
}

export function addComment(comment: IComment): ICommentsAction {
	return {
		type: "ADD_COMMENT",
		payload: comment
	};
}

export function removeComment(idComment: number): ICommentsRemoveAction {
	return {
		type: "REMOVE_COMMENT",
		payload: idComment
	};
}