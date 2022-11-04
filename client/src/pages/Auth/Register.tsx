import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/Header/Logo";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import AlertContext from "../../context/alert.context";
import classes from "./Auth.module.sass";
import Alert from "../../components/UI/Alert/Alert";
import Loader from "../../components/UI/Loader/Loader";
import { usePromiseTracker } from "react-promise-tracker";
import register from "../../http/auth/register.http";
import cn from "classnames";
import useTheme from "../../hooks/useTheme";

function Register() {
	const { light, dark } = useTheme();
	const [user, setUser] = React.useState({ fullName: "", userName: "", email: "", password: "" });
	const [errors, setErrors] = React.useState<boolean>(false);
	const { text, setText } = React.useContext(AlertContext);
	const navigate = useNavigate();
	const { promiseInProgress } = usePromiseTracker();

	function regisSubmit(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault();

		register(user)
			.then((data) => {
				const { errors: dataErrors, success, message, error } = data;

				if (dataErrors && dataErrors.length) {
					setErrors(!errors);
					return;
				}

				if (!success) {
					if (message) {
						setText(`Ошибка сервера: ${message}`);
						return;
					}

					setText(error);
					return;
				}

				navigate("/auth/login");
			});
	}

	return (
		<React.Fragment>
			{text && <Alert />}
			{promiseInProgress === true && <Loader />}
			<article className={cn(classes.wrapper, {
				[classes.light]: light,
				[classes.dark]: dark
			})}>
				<Logo className={classes.title} />
				{errors && <span className={classes.wrong}>Ошибка отправки. Проверьте корректность данных</span>}
				<form onSubmit={regisSubmit} className={classes.form}>
					<Input
						type="text"
						value={user.userName}
						placeholder="Имя пользователя"
						onChange={event => setUser({ ...user, userName: event.target.value })}
					/>
					<Input
						type="text"
						value={user.fullName}
						placeholder="Полное имя"
						onChange={event => setUser({ ...user, fullName: event.target.value })}
					/>
					<Input
						type="email"
						value={user.email}
						placeholder="Электронная почта"
						onChange={event => setUser({ ...user, email: event.target.value })}
					/>
					<Input
						type="password"
						value={user.password}
						placeholder="Пароль"
						onChange={event => setUser({ ...user, password: event.target.value })}
					/>
					<Button
						className={classes.submit}
					>
						Зарегистрироваться
					</Button>
				</form>
				<p className={classes.text}>
					Есть аккаунт? <Link to="/auth/login">Войти</Link>
				</p>
			</article>
		</React.Fragment>
	);
}

export default Register;