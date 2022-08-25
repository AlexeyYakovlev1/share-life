import { Route, Routes } from "react-router-dom";
import AddPost from "../pages/AddPost/AddPost";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Home from "../pages/Home/Home";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";

function useRoutes(isAuth: boolean) {
	if (!isAuth) {
		return (
			<Routes>
				<Route path="/auth/login" element={<Login />} />
				<Route path="/auth/register" element={<Register />} />
			</Routes>
		);
	}

	return (
		<Routes>
			<Route path="/profile/:id" element={<Profile />} />
			<Route path="/" element={<Home />} />
			<Route path="/write" element={<AddPost />} />
			<Route path="/settings" element={<Settings />} />
		</Routes>
	);
}

export default useRoutes;