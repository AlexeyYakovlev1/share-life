import Cookies from "js-cookie";
import React from "react";
import { useDispatch } from "react-redux";
import AlertContext from "./context/alert.context";
import useRoutes from "./hooks/useRoutes";
import checkAuth from "./http/auth/checkAuth.http";
import getAllPosts from "./http/posts/getAllPosts.http";
import { setPosts } from "./redux/actions/posts.actions";
import { setUser } from "./redux/actions/user.actions";
import { trackPromise } from "react-promise-tracker";

function App() {
	const dispatch = useDispatch();
	const routes = useRoutes();

	const [text, setText] = React.useState<string>("");

	React.useEffect(() => {
		// check authentication
		trackPromise(checkAuth()
			.then(data => {
				const { token, person, success } = data;

				if (!success) return;

				Cookies.set("token", token);
				dispatch(setUser(person));
			}));

		// get posts
		trackPromise(getAllPosts()
			.then((data) => {
				const { success, message, posts } = data;

				if (!success) {
					setText(message);
					return;
				}

				dispatch(setPosts(posts));
			}));
	}, []);

	return (
		<AlertContext.Provider value={{ text, setText }}>
			{routes}
		</AlertContext.Provider>
	);
}

export default App;
