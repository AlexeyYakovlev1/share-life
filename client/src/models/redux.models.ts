import { IPerson } from "./person.models";

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
}