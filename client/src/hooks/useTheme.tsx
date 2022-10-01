import { useSelector } from "react-redux";
import { IState } from "../models/redux.models";

function useTheme() {
	const theme = useSelector((state: IState) => state.theme);

	return {
		light: theme === "LIGHT",
		dark: theme === "DARK"
	};
}

export default useTheme;