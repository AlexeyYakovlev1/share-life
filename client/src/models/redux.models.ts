import { IPerson } from "./person.models";
import { IComment, IPost } from "./post.models";

export interface IPersonAction {
	type: string;
	payload: IPerson;
	logout: boolean;
}

export interface IUserReducer {
	info: IPerson;
	isAuth: boolean;
}

export interface IState {
	person: IUserReducer;
	posts: Array<IPost>;
	comments: Array<IComment>;
}

export interface IPostAction {
	type: string;
	payload: Array<IPost> | IPost;
}

export interface IPostRemoveAction {
	type: string;
	payload: number;
}

export interface ICommentsAction {
	type: string;
	payload: Array<IComment> | IComment;
}

export interface ICommentsRemoveAction {
	type: string;
	payload: number;
}