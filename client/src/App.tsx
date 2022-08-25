import Cookies from "js-cookie";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import AlertContext from "./context/alert.context";
import LoaderContext from "./context/loader.context";
import useRoutes from "./hooks/useRoutes";
import checkAuth from "./http/checkAuth.http";
import { IState } from "./models/redux.models";
import { setUser } from "./redux/actions/user.actions";

function App() {
	const { isAuth } = useSelector((state: IState) => state.person);
	const dispatch = useDispatch();

	const routes = useRoutes(isAuth);

	const [load, setLoad] = React.useState<boolean>(false);
	const [text, setText] = React.useState<string>("");

	React.useEffect(() => {
		setLoad(true);
		checkAuth()
			.then(data => {
				const { token, person, success } = data;

				if (!success) {
					setLoad(false);
					return;
				}

				Cookies.set("token", token);
				dispatch(setUser(person));
			});
		setLoad(false);
	}, []);

	return (
		<LoaderContext.Provider value={{ load, setLoad }}>
			<AlertContext.Provider value={{ text, setText }}>
				{routes}
			</AlertContext.Provider>
		</LoaderContext.Provider>
	);
}

export default App;
