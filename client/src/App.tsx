import Cookies from "js-cookie";
import React from "react";
import { useDispatch } from "react-redux";
import AlertContext from "./context/alert.context";
import NotificationCount from "./context/notificationCount.context";
import useRoutes from "./hooks/useRoutes";
import checkAuthAsyncAction from "./redux/actions/async/auth/checkAuth";
import { setTheme } from "./redux/actions/theme.actions";

function App() {
	const dispatch: any = useDispatch();
	const routes = useRoutes();
	const currentTheme: any = Cookies.get("theme") || "LIGHT";

	const [text, setText] = React.useState<string>("");
	const [count, setCount] = React.useState<number>(0);

	React.useEffect(() => {
		dispatch(checkAuthAsyncAction());
		dispatch(setTheme(currentTheme));

		document.body.classList.add(currentTheme.toLowerCase());
	}, []);

	return (
		<AlertContext.Provider value={{ text, setText }}>
			<NotificationCount.Provider value={{ count, setCount }}>
				{routes}
			</NotificationCount.Provider>
		</AlertContext.Provider>
	);
}

export default App;
