import { IPersonAction } from "../../models/redux.models";
import Cookies from "js-cookie";

const initialState = {
	info: {
		id: -1,
		full_name: "",
		user_name: "",
		email: "",
		avatar: {
			base64: "",
			filename: ""
		},
		password: "",
		description: "",
		roles: [""]
	},
	isAuth: false
};

// TYPES
const SET_USER = "SET_USER";

function userReducer(state = initialState, action: IPersonAction) {
	switch (action.type) {
		case SET_USER:
			if (action.logout) {
				Cookies.remove("token");

				return {
					isAuth: false,
					info: initialState.info
				};
			}

			return {
				info: action.payload,
				isAuth: true
			};
		default:
			return state;
	}
}

export default userReducer;