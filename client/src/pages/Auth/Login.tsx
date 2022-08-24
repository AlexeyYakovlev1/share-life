import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../components/Header/Logo";
import Alert from "../../components/UI/Alert/Alert";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import Loader from "../../components/UI/Loader/Loader";
import AlertContext from "../../context/alert.context";
import LoaderContext from "../../context/loader.context";
import classes from "./Auth.module.sass";
import Cookies from "js-cookie";

const { REACT_APP_API_URL } = process.env;

function Login() {
	const [user, setUser] = React.useState({
		email: "", password: ""
	});
	const [errors, setErrors] = React.useState<boolean>(false);

	const { text, setText } = React.useContext(AlertContext);
	const { load, setLoad } = React.useContext(LoaderContext);

	function logSubmit(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault();

		fetch(`${REACT_APP_API_URL}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(user)
		})
			.then((response) => response.json())
			.then((data) => {
				const { errors: dataErrors, success, message, error, token } = data;

				if (dataErrors && dataErrors.length) {
					setLoad(false);
					setErrors(!errors);
					return;
				}

				if (!success) {
					setLoad(false);

					if (message) {
						setText(`Server error: ${message}`);
						return;
					}

					setText(error);
					return;
				}

				Cookies.set("token", token);
			});
	}

	return (
		<React.Fragment>
			{text && <Alert />}
			{load && <Loader />}
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