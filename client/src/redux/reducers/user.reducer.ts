import { IPersonAction } from "../../models/redux.models";
import Cookies from "js-cookie";

const initialState = {
	info: {
		id: -1,
		full_name: "",
		user_name: "",
		email: "",
		avatar: "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg",
		password: "",
		roles: ["USER"]
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