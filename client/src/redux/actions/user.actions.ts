import { IPerson } from "../../models/person.models";
import { IPersonAction } from "../../models/redux.models";

export function setUser(user: IPerson, logout = false): IPersonAction {
	return {
		type: "SET_USER",
		payload: user,
		logout
	};
}