import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/Header/Logo";
import Alert from "../../components/UI/Alert/Alert";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import Loader from "../../components/UI/Loader/Loader";
import AlertContext from "../../context/alert.context";
import { trackPromise } from "react-promise-tracker";
import classes from "./Auth.module.sass";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser as setUserToReducer } from "../../redux/actions/user.actions";
import login from "../../http/auth/login.http";
import { usePromiseTracker } from "react-promise-tracker";

function Login() {
	const dispatch = useDispatch();
	const [user, setUser] = React.useState({ email: "", password: "" });
	const [errors, setErrors] = React.useState<boolean>(false);
	const { text, setText } = React.useContext(AlertContext);
	const navigation = useNavigate();
	const { promiseInProgress } = usePromiseTracker();

	function logSubmit(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault();

		trackPromise(login(user)
			.then((data) => {
				const { errors: dataErrors, success, message, error, token, person }: any = data;

				if (dataErrors && dataErrors.length) {
					setErrors(!errors);
					return;
				}

				if (!success) {
					if (message) {
						setText(`Server error: ${message}`);
						return;
					}

					setText(error);
					return;
				}

				Cookies.set("token", token);
				dispatch(setUserToReducer(person));
				navigation("/");
			}));
	}

	return (
		<React.Fragment>
			{text && <Alert />}
			{promiseInProgress === true && <Loader />}
			<div className={classes.wrapper}>
				<Logo className={classes.title} />
				{errors && <span className={classes.wrong}>Submit failed. Check your data</span>}
				<form onSubmit={logSubmit} className={classes.form}>
					<Input
						type="email"
						value={user.email}
						placeholder="Email"
						onChange={event => setUser({ ...user, email: event.target.value })}
					/>
					<Input
						type="password"
						value={user.password}
						placeholder="Password"
						onChange={event => setUser({ ...user, password: event.target.value })}
					/>
					<Button className={classes.submit}>Log in</Button>
				</form>
				<p className={classes.text}>
					Dont have an account? <Link to="/auth/register">Sign up</Link>
				</p>
			</div>
		</React.Fragment>
	);
}

export default Login;