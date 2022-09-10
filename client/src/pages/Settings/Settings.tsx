import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import AlertContext from "../../context/alert.context";
import { trackPromise } from "react-promise-tracker";
import { IState } from "../../models/redux.models";
import classes from "./Settings.module.sass";
import { setUser as setUserToReducer } from "../../redux/actions/user.actions";
import updateUser from "../../http/user/updateUser.http";
import uploadAvatar from "../../http/files/uploadAvatar.http";
import useAvatar from "../../hooks/useAvatar";
import { IPerson } from "../../models/person.models";

interface IPersonForSettings extends IPerson {
	oldPassword?: string;
	newPassword?: string;
}

function Settings(): JSX.Element {
	const avatarRef = React.useRef<HTMLInputElement | null>(null);
	const navigate = useNavigate();

	const info = useSelector((state: IState) => state.person.info);
	const dispatch = useDispatch();

	const [avatar, setAvatar] = React.useState({
		base64: info.avatar.base64,
		file: ""
	});
	const [user, setUser] = React.useState<IPersonForSettings>({ ...info });

	const { setText } = React.useContext(AlertContext);

	React.useEffect(() => {
		if (info.id < 0) return;
		setUser({ ...info });
	}, [info]);

	// update avatar
	function uploadHandler(event: any) {
		if (!event.target?.files.length) return;

		const file = event.target?.files[0];
		const formData = new FormData();
		formData.append("avatar", file);

		const reader: any = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = () => {
			const result = reader.result;
			setAvatar({ ...avatar, base64: result });

			uploadAvatar(formData, true)
				.then((data) => {
					const { success, message, error, dataFile: { inBase64, filename } } = data;

					setText(message || error);

					if (!success) return;

					dispatch(setUserToReducer({ ...info, avatar: { base64: inBase64, filename } }));
				});
		};

		reader.onerror = () => {
			setText(reader.error.message);
			return;
		};
	}

	// update user
	function submitUpdate(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault();

		trackPromise(updateUser(info.id, user)
			.then((data) => {
				const { success, message, error, person } = data;

				setText(message || error);

				if (!success) {
					return;
				}

				dispatch(setUserToReducer(person));
			}));
	}

	// logout
	function logout() {
		dispatch(setUserToReducer({ ...user }, true));
		navigate("/auth/login");
	}

	return (
		<MainLayout>
			<div className={classes.wrapper}>
				<div className={classes.user}>
					<img
						src={useAvatar(info.avatar.base64)}
						alt={user.user_name}
					/>
					<div className={classes.userInfo}>
						<span className={classes.userInfoName}>
							<Link to={`/profile/${info.id}`}>{info.user_name}</Link>
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
							defaultValue={info.full_name}
						/>
					</div>
					<div className={classes.formInputBlock}>
						<label htmlFor="userName">User Name</label>
						<Input
							onChange={event => setUser({ ...user, user_name: event.target.value })}
							id="userName"
							type="text"
							defaultValue={info.user_name}
						/>
					</div>
					<div className={classes.formInputBlock}>
						<label htmlFor="description">Description</label>
						<textarea
							onChange={event => setUser({ ...user, description: event.target.value })}
							id="description"
							defaultValue={info.description}
						/>
					</div>
					<div className={classes.formInputBlock}>
						<label htmlFor="email">Email</label>
						<Input
							onChange={event => setUser({ ...user, email: event.target.value })}
							id="email"
							type="text"
							defaultValue={info.email}
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