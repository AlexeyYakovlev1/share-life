import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/Header/Logo";
import Alert from "../../components/UI/Alert/Alert";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import Loader from "../../components/UI/Loader/Loader";
import AlertContext from "../../context/alert.context";
import classes from "./Auth.module.sass";
import { useDispatch } from "react-redux";
import { usePromiseTracker } from "react-promise-tracker";
import cn from "classnames";
import useTheme from "../../hooks/useTheme";
import loginAsyncAction from "../../redux/actions/async/auth/login";

function Login() {
	const { light, dark } = useTheme();
	const dispatch: any = useDispatch();
	const [user, setUser] = React.useState({ email: "", password: "" });
	const [errors, setErrors] = React.useState<boolean>(false);
	const { text, setText } = React.useContext(AlertContext);
	const navigation = useNavigate();
	const { promiseInProgress } = usePromiseTracker();

	function logSubmit(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		dispatch(loginAsyncAction(user, setErrors, setText, navigation));
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
				<form onSubmit={logSubmit} className={classes.form}>
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
					<Button className={classes.submit}>Войти</Button>
				</form>
				<p className={classes.text}>
					Нет аккаунта? <Link to="/auth/register">Зарегистрироваться</Link>
				</p>
			</article>
		</React.Fragment>
	);
}

export default Login;