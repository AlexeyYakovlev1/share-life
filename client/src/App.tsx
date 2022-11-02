import Cookies from "js-cookie";
import React from "react";
import { useDispatch } from "react-redux";
import AlertContext from "./context/alert.context";
import NotificationContext from "./context/notification.context";
import useRoutes from "./hooks/useRoutes";
import checkAuthAsyncAction from "./redux/actions/async/auth/checkAuth";
import { setTheme } from "./redux/actions/theme.actions";
import socket from "socket.io-client";

const { REACT_APP_API_URL } = process.env;

function App() {
	const dispatch: any = useDispatch();
	const routes = useRoutes();
	const currentTheme: any = Cookies.get("theme") || "LIGHT";
	const io: any = socket;
	const socketConnection = io.connect(REACT_APP_API_URL);

	const [text, setText] = React.useState<string>("");
	const [count, setCount] = React.useState<number>(0);
	const [likeIds, setLikeIds] = React.useState<Array<number>>([]);

	React.useEffect(() => {
		dispatch(checkAuthAsyncAction());
		dispatch(setTheme(currentTheme));

		document.body.classList.add(currentTheme.toLowerCase());

		socketConnection.on("notification-like", (data: any) => {
			if (!data.access) return;
			console.log(data);
		});

		return () => {
			socketConnection.off("notification-like");
		};
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
