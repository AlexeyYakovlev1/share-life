import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import AlertContext from "../../context/alert.context";
import LoaderContext from "../../context/loader.context";
import { IState } from "../../models/redux.models";
import classes from "./Settings.module.sass";
import { setUser as setUserToReducer } from "../../redux/actions/user.actions";
import useAvatar from "../../hooks/useAvatar";
import updateUser from "../../http/user/updateUser.http";
import uploadAvatar from "../../http/files/uploadAvatar.http";

function Settings(): JSX.Element {
	const avatarRef = React.useRef<HTMLInputElement | null>(null);
	const navigate = useNavigate();

	const { id, full_name, user_name, email, description, avatar: oldAvatar } = useSelector((state: IState) => state.person.info);
	const dispatch = useDispatch();

	const [user, setUser] = React.useState({
		id: -1,
		user_name: "",
		full_name: "",
		email: "",
		avatar: "",
		description: "",
		password: "",
		oldPassword: "",
		newPassword: "",
		roles: [""]
	});
	const [avatar, setAvatar] = React.useState({
		filename: "", file: ""
	});

	const { setLoad } = React.useContext(LoaderContext);
	const { setText } = React.useContext(AlertContext);

	let currentAvatarUser = useAvatar(oldAvatar);

	function submitUpdate(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault();

		setLoad(true);

		if (id > 0) {
			const payload = { ...user, avatar: avatar.filename };

			updateUser(id, payload)
				.then((data) => {
					const { success, message } = data;

					if (!success) {
						setLoad(false);
						setText(message);
						return;
					}

					setLoad(false);
					setText(message);
				});
		}

		setLoad(false);
	}

	function uploadHandler(event: any) {
		if (!event.target.files.length) return;

		setLoad(true);
		const formData = new FormData();
		formData.append("avatar", event.target.files[0]);

		uploadAvatar(formData)
			.then((response) => {
				const { success, dataFile, message } = response.data;

				if (!success) {
					setLoad(false);
					setText(message);
					return;
				}

				setAvatar({ filename: dataFile.filename, file: dataFile.inBase64 });
				currentAvatarUser = useAvatar(dataFile.filename);
				setLoad(false);
			});
		setLoad(false);
	}

	function logout() {
		dispatch(setUserToReducer(user, true));
		navigate("/auth/login");
	}

	return (
		<MainLayout>
			<div className={classes.wrapper}>
				<div className={classes.user}>
					<img
						src={currentAvatarUser}
						alt={user.user_name}
					/>
					<div className={classes.userInfo}>
						<span className={classes.userInfoName}>
							<Link to={`/profile/${id}`}>{user_name}</Link>
						</span>
						<input
							type="file"
							style={{ display: "none" }}
							ref={avatarRef}
							accept="image/*"
							onChange={uploadHandler}
						/>
						<Button
							className={classes.userInfoChangeAvatarBtn}
							onClick={() => avatarRef.current?.click()}
						>
							Change Profile Photo
						</Button>
					</div>
				</div>
				<form onSubmit={submitUpdate} className={classes.form}>
					<div className={classes.formInputBlock}>
						<label htmlFor="fullName">Full Name</label>
						<Input
							onChange={event => setUser({ ...user, full_name: event.target.value })}
							id="fullName"
							type="text"
							defaultValue={full_name}
						/>
					</div>
					<div className={classes.formInputBlock}>
						<label htmlFor="userName">User Name</label>
						<Input
							onChange={event => setUser({ ...user, user_name: event.target.value })}
							id="userName"
							type="text"
							defaultValue={user_name}
						/>
					</div>
					<div className={classes.formInputBlock}>
						<label htmlFor="description">Description</label>
						<textarea
							onChange={event => setUser({ ...user, description: event.target.value })}
							id="description"
							defaultValue={description}
						/>
					</div>
					<div className={classes.formInputBlock}>
						<label htmlFor="email">Email</label>
						<Input
							onChange={event => setUser({ ...user, email: event.target.value })}
							id="email"
							type="text"
							defaultValue={email}
						/>
					</div>
					<div className={classes.formInputBlock}>
						<label htmlFor="oldPassword">Old password</label>
						<Input
							onChange={event => setUser({ ...user, oldPassword: event.target.value })}
							id="oldPassword"
							type="password"
						/>
					</div>
					<div className={classes.formInputBlock}>
						<label htmlFor="newPassword">New password</label>
						<Input
							onChange={event => setUser({ ...user, newPassword: event.target.value })}
							id="newPassword"
							type="password"
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