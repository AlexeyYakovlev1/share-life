import { Route, Routes } from "react-router-dom";
import AddPost from "../pages/AddPost/AddPost";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Home from "../pages/Home/Home";
import Profile from "../pages/Profile/Profile";

function useRoutes() {
	return (
		<Routes>
			<Route path="/auth/login" element={<Login />} />
			<Route path="/auth/register" element={<Register />} />
			<Route path="/profile/:id" element={<Profile />} />
			<Route path="/" element={<Home />} />
			<Route path="/write" element={<AddPost />} />
		</Routes>
	);
}

export default useRoutes;