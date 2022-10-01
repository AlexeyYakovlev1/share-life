import Cookies from "js-cookie";
import { IThemeAction } from "../../models/redux.models";

const SET_THEME = "SET_THEME";

function themeReducer(state = "LIGHT", action: IThemeAction) {
	switch (action.type) {
		case SET_THEME:
			if (!action.payload) return state;
			Cookies.set("theme", action.payload);
			return action.payload;
		default:
			return state;
	}
}

export default themeReducer;