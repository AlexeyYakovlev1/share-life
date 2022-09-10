import { IFullPost } from "../redux/reducers/posts.reducer";
import { IPerson } from "./person.models";
import { IPost } from "./post.models";

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
}

export interface IPostAction {
	type: string;
	payload: Array<IFullPost> | IFullPost;
}

export interface IPostRemoveAction {
	type: string;
	payload: number;
}