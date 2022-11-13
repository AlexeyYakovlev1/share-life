import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import AlertContext from "../../context/alert.context";
import { IState } from "../../models/redux.models";
import classes from "./Settings.module.sass";
import { setUser as setUserToReducer } from "../../redux/actions/user.actions";
import useAvatar from "../../hooks/user/useAvatar";
import { IPerson } from "../../models/person.models";
import { setTheme } from "../../redux/actions/theme.actions";
import Textarea from "../../components/UI/Textarea/Textarea";
import Label from "../../components/UI/Label/Label";
import useTheme from "../../hooks/useTheme";
import cn from "classnames";
import updateUserAsyncAction from "../../redux/actions/async/user/updateUser";
import updateAvatarAsyncAction from "../../redux/actions/async/user/updateAvatar";

interface IPersonForSettings extends IPerson {
	oldPassword?: string;
	newPassword?: string;
}

function Settings(): JSX.Element {
	const avatarRef = React.useRef<HTMLInputElement | null>(null);
	const navigate = useNavigate();
	const { light, dark } = useTheme();

	const info = useSelector((state: IState) => state.person.info);
	const theme = useSelector((state: IState) => state.theme);

	const dispatch: any = useDispatch();
	const [user, setUser] = React.useState<IPersonForSettings>({
		...info, newPassword: undefined, oldPassword: undefined
	});
	const { setText } = React.useContext(AlertContext);

	React.useEffect(() => {
		if (info.id < 0) return;
		setUser({ ...info });
	}, [info]);

	function uploadAvatarHandler(event: any) {
		dispatch(updateAvatarAsyncAction(event, setText, info));
	}

	function submitUpdate(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		dispatch(updateUserAsyncAction(info.id, user, setText));
		setUser({ ...info, newPassword: "", oldPassword: "" });
	}

	function logout() {
		dispatch(setUserToReducer({ ...user }, true));
		navigate("/auth/login");
	}

	function selectTheme(theme: "LIGHT" | "DARK") {
		dispatch(setTheme(theme));
		document.body.className = theme.toLowerCase();
	}

	return (
		<MainLayout>
			<article className={cn(classes.wrapper, {
				[classes.light]: light,
				[classes.dark]: dark
			})}>
				<div className={classes.theme}>
					<h2 className={classes.themeTitle}>Тема</h2>
					<div className={classes.themeSelect}>
						<Button
							onClick={() => selectTheme("LIGHT")}
							className={theme === "LIGHT" ? classes.themeSelectActive : undefined}
						>
							Светлая
						</Button>
						<Button onClick={() => selectTheme("DARK")}>
							Темная
						</Button>
					</div>
				</div>
				<div className={classes.user}>
					<div
						className={classes.userAvatar}
						style={{ backgroundImage: `url(${useAvatar(info.avatar.base64)})` }}
					></div>
					<div className={classes.userInfo}>
						<span className={classes.userInfoName}>
							<Link to={`/profile/${info.id}`}>{info.user_name}</Link>
						</span>
						<input
							type="file"
							hidden
							ref={avatarRef}
							accept="image/*"
							onChange={uploadAvatarHandler}
						/>
						<Button
							className={classes.userInfoChangeAvatarBtn}
							onClick={() => avatarRef.current?.click()}
						>
							Выбрать другое фото
						</Button>
					</div>
				</div>
				<form onSubmit={submitUpdate} className={classes.form}>
					<div className={classes.formInputBlock}>
						<Label htmlFor="fullName">Полное имя</Label>
						<Input
							onChange={event => setUser({ ...user, full_name: event.target.value })}
							id="fullName"
							type="text"
							defaultValue={info.full_name}
						/>
					</div>
					<div className={classes.formInputBlock}>
						<Label htmlFor="userName">Имя пользователя</Label>
						<Input
							onChange={event => setUser({ ...user, user_name: event.target.value })}
							id="userName"
							type="text"
							defaultValue={info.user_name}
						/>
					</div>
					<div className={classes.formInputBlock}>
						<Label htmlFor="description">Описание профиля</Label>
						<Textarea
							onChange={event => setUser({ ...user, description: event.target.value })}
							id="description"
							defaultValue={info.description}
						/>
					</div>
					<div className={classes.formInputBlock}>
						<Label htmlFor="email">Электронная почта</Label>
						<Input
							onChange={event => setUser({ ...user, email: event.target.value })}
							id="email"
							type="text"
							defaultValue={info.email}
						/>
					</div>
					<div className={classes.formInputBlock}>
						<Label htmlFor="oldPassword">Старый пароль</Label>
						<Input
							value={user.oldPassword || ""}
							onChange={event => setUser({ ...user, oldPassword: event.target.value })}
							id="oldPassword"
							type="password"
						/>
					</div>
					<div className={classes.formInputBlock}>
						<Label htmlFor="newPassword">Новый пароль</Label>
						<Input
							value={user.newPassword || ""}
							onChange={event => setUser({ ...user, newPassword: event.target.value })}
							id="newPassword"
							type="password"
						/>
					</div>
					<div className={classes.downActions}>
						<Button className={classes.formSubmit}>Отправить</Button>
						<Button
							onClick={logout}
							className={classes.logout}
						>
							Выйти
						</Button>
					</div>
				</form>
			</article>
		</MainLayout>
	);
}

export default Settings;