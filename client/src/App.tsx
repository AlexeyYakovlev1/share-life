import Cookies from "js-cookie";
import React from "react";
import { useDispatch } from "react-redux";
import AlertContext from "./context/alert.context";
import NotificationContext from "./context/notification.context";
import useRoutes from "./hooks/useRoutes";
import checkAuthAsyncAction from "./redux/actions/async/auth/checkAuth";
import { setTheme } from "./redux/actions/theme.actions";

function App() {
	const dispatch: any = useDispatch();
	const routes = useRoutes();
	const currentTheme: any = Cookies.get("theme") || "LIGHT";

	const [text, setText] = React.useState<string>("");
	const [count, setCount] = React.useState<number>(0);
	const [likeIds, setLikeIds] = React.useState<Array<number>>([]);

	React.useEffect(() => {
		dispatch(checkAuthAsyncAction());
		dispatch(setTheme(currentTheme));

		document.body.classList.add(currentTheme.toLowerCase());
	}, []);

	return (
		<AlertContext.Provider value={{ text, setText }}>
			<NotificationContext.Provider value={{ count, setCount, likeIds, setLikeIds }}>
				{routes}
			</NotificationContext.Provider>
		</AlertContext.Provider>
	);
}

export default App;
