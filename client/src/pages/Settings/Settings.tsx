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
import updateUser from "../../http/user/updateUser.http";
import uploadAvatar from "../../http/files/uploadAvatar.http";
import useAvatar from "../../hooks/useAvatar";

function Settings(): JSX.Element {
	const avatarRef = React.useRef<HTMLInputElement | null>(null);
	const navigate = useNavigate();

	const { id, full_name, user_name, email, description, avatar: oldAvatar, roles, password } = useSelector((state: IState) => state.person.info);
	const dispatch = useDispatch();

	const [selectImage, setSelectImage] = React.useState(null);
	const [update, setUpdate] = React.useState<boolean>(false);
	const [avatar, setAvatar] = React.useState<any>({
		base64: useAvatar(oldAvatar),
		filename: ""
	});
	const [user, setUser] = React.useState({
		id,
		user_name,
		full_name,
		email,
		avatar,
		description,
		password,
		oldPassword: "",
		newPassword: "",
		roles
	});

	const { setLoad } = React.useContext(LoaderContext);
	const { setText } = React.useContext(AlertContext);

	React.useEffect(() => {
		if (id > 0) {
			setUser({
				id,
				user_name,
				full_name,
				email,
				avatar: useAvatar(oldAvatar),
				description,
				oldPassword: "",
				password,
				newPassword: "",
				roles
			});
		}
	}, [id]);

	React.useEffect(() => {
		if (update && selectImage) {
			setLoad(true);

			const formData = new FormData();
			formData.append("avatar", selectImage);

			uploadAvatar(formData)
				.then((data: any) => {
					const { success, message, dataFile } = data;
					if (!dataFile.filename) return;

					setText(message);

					if (!success) {
						setLoad(false);
						setUpdate(false);
						return;
					}

					setAvatar({ ...avatar, filename: dataFile.filename });
					dispatch(setUserToReducer({ ...user, avatar: dataFile.inBase64 }));
					setUpdate(false);
				});

			setLoad(false);
		}
	}, [update]);

	function uploadHandler(event: any) {
		if (!event.target?.files.length) return;
		setLoad(true);

		const file = event.target?.files[0];
		setSelectImage(file);

		const reader: any = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = () => {
			const result = reader.result;
			setAvatar((_: any) => ({ base64: result, filename: file.name }));
		};

		reader.onerror = () => {
			setLoad(false);
			setText(reader.error.message);
			return;
		};
		setLoad(false);
	}

	function submitUpdate(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault();

		setLoad(true);

		if (id > 0) {
			setUpdate(true);
			updateUser(id, user)
				.then((data) => {
					const { success, message, error } = data;

					setText(message || error);

					if (!success) {
						setLoad(false);
						setUpdate(false);
						return;
					}

					setLoad(false);
					setUpdate(true);
				});
		}

		setLoad(false);
	}

	function logout() {
		dispatch(setUserToReducer({ ...user }, true));
		navigate("/auth/login");
	}

	return (
		<MainLayout>
			<div className={classes.wrapper}>
				<div className={classes.user}>
					<img
						src={user.avatar || avatar.base64}
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