import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import AlertContext from "../../context/alert.context";
import LoaderContext from "../../context/loader.context";
import getOneUser from "../../http/getOneUser.http";
import { IPerson } from "../../models/person.models";
import { IState } from "../../models/redux.models";
import classes from "./Settings.module.sass";
import { setUser as setUserToReducer } from "../../redux/actions/user.actions";

function Settings(): JSX.Element {
	const [user, setUser] = React.useState<IPerson>({
		id: -1,
		user_name: "",
		full_name: "",
		email: "",
		avatar: "",
		description: "",
		password: "",
		roles: ["USER"]
	});

	const avatarRef = React.useRef<HTMLInputElement | null>(null);
	const navigate = useNavigate();

	const { id } = useSelector((state: IState) => state.person.info);
	const dispatch = useDispatch();

	const { setLoad } = React.useContext(LoaderContext);
	const { setText } = React.useContext(AlertContext);

	React.useEffect(() => {
		if (id > 0) {
			setLoad(true);
			getOneUser(+id)
				.then((data) => {
					const { success, person, message } = data;

					if (!success) {
						setLoad(false);
						setText(message);
						return;
					}

					setUser(person);
				});
			setLoad(false);
		}
	}, [id]);

	function logout() {
		dispatch(setUserToReducer(user, true));
		navigate("/auth/login");
	}

	return (
		<MainLayout>
			<div className={classes.wrapper}>
				<div className={classes.user}>
					<img
						src={user.avatar}
						alt={user.user_name}
					/>
					<div className={classes.userInfo}>
						<span className={classes.userInfoName}>
							<Link to={`/profile/${user.id}`}>{user.user_name}</Link>
						</span>
						<input
							type="file"
							style={{ display: "none" }}
							ref={avatarRef}
							accept="image/*"
						/>
						<Button
							className={classes.userInfoChangeAvatarBtn}
							onClick={() => avatarRef.current?.click()}
						>
							Change Profile Photo
						</Button>
					</div>
				</div>
				<form className={classes.form}>
					<div className={classes.formInputBlock}>
						<label htmlFor="fullName">Full Name</label>
						<Input
							id="fullName"
							type="text"
							defaultValue={user.full_name}
						/>
					</div>
					<div className={classes.formInputBlock}>
						<label htmlFor="userName">User Name</label>
						<Input
							id="userName"
							type="text"
							defaultValue={user.user_name}
						/>
					</div>
					<div className={classes.formInputBlock}>
						<label htmlFor="description">Description</label>
						<textarea
							id="description"
							defaultValue={user.description}
						/>
					</div>
					<div className={classes.formInputBlock}>
						<label htmlFor="email">Email</label>
						<Input
							id="email"
							type="text"
							defaultValue={user.email}
						/>
					</div>
					<div className={classes.downActions}>
						<Button className={classes.formSubmit}>Submit</Button>
						<Button
							onClick={logout}
							className={classes.logout}
						>
							Logout
						</Button>
					</div>
				</form>
			</div>
		</MainLayout>
	);
}

export default Settings;