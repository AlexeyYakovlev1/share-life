import { IThemeAction } from "../../models/redux.models";

export const setTheme = (theme: "LIGHT" | "DARK"): IThemeAction => {
	return {
		type: "SET_THEME",
		payload: theme
	};
};
