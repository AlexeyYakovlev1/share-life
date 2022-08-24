import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/Header/Logo";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import AlertContext from "../../context/alert.context";
import LoaderContext from "../../context/loader.context";
import classes from "./Auth.module.sass";
import Alert from "../../components/UI/Alert/Alert";
import Loader from "../../components/UI/Loader/Loader";

const { REACT_APP_API_URL } = process.env;

function Register() {
	const [user, setUser] = React.useState({
		fullName: "", userName: "", email: "", password: ""
	});
	const [errors, setErrors] = React.useState<boolean>(false);

	const { text, setText } = React.useContext(AlertContext);
	const { load, setLoad } = React.useContext(LoaderContext);

	const navigate = useNavigate();

	function regisSubmit(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		setLoad(true);

		fetch(`${REACT_APP_API_URL}/auth/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(user)
		})
			.then((response) => response.json())
			.then((data) => {
				const { errors: dataErrors, success, message, error } = data;

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

				navigate("/auth/login");
			});
		setLoad(false);
	}

	return (
		<React.Fragment>
			{text && <Alert />}
			{load && <Loader />}
			<div className={classes.wrapper}>
				<Logo className={classes.title} />
				{errors && <span className={classes.wrong}>Submit failed. Check your data</span>}
				<form onSubmit={regisSubmit} className={classes.form}>
					<Input
						type="text"
						value={user.userName}
						placeholder="User Name"
						onChange={event => setUser({ ...user, userName: event.target.value })}
					/>
					<Input
						type="text"
						value={user.fullName}
						placeholder="Full Name"
						onChange={event => setUser({ ...user, fullName: event.target.value })}
					/>
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
					<Button
						className={classes.submit}
					>
						Sign up
					</Button>
				</form>
				<p className={classes.text}>
					Have an account? <Link to="/auth/login">Log in</Link>
				</p>
			</div>
		</React.Fragment>
	);
}

export default Register;