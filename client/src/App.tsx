import React from "react";
import { useDispatch } from "react-redux";
import AlertContext from "./context/alert.context";
import useRoutes from "./hooks/useRoutes";
import checkAuthAsyncAction from "./redux/actions/async/auth/checkAuth";
import getPostsAsyncAction from "./redux/actions/async/posts/getPosts";

function App() {
	const dispatch: any = useDispatch();

	React.useEffect(() => {
		dispatch(checkAuthAsyncAction());
	}, []);

	const routes = useRoutes();
	const [text, setText] = React.useState<string>("");

	React.useEffect(() => {
		dispatch(getPostsAsyncAction(setText));
	}, []);

	return (
		<AlertContext.Provider value={{ text, setText }}>{routes}</AlertContext.Provider>
	);
}

export default App;
