import { Route, Routes } from "react-router-dom";
import AddPost from "../pages/AddPost/AddPost";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Interaction from "../pages/Interaction/Interaction";
import Home from "../pages/Home/Home";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";
import ChangePost from "../pages/ChangePost/ChangePost";
import Error from "../pages/Error/Error";

function useRoutes() {
	return (
		<Routes>
			<Route path="/auth/login" element={<Login />} />
			<Route path="/auth/register" element={<Register />} />

			<Route path="/profile/:id" element={<Profile />} />
			<Route path="/" element={<Home />} />
			<Route path="/write" element={<AddPost />} />
			<Route path="/settings" element={<Settings />} />
			<Route path="/interaction/:id" element={<Interaction />} />
			<Route path="/change-post/:id" element={<ChangePost />} />

			<Route path="*" element={<Error />} />
		</Routes>
	);
}

export default useRoutes;