import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import classes from "./Auth.module.sass";

function Login() {
	const [user, setUser] = React.useState({
		email: "", password: ""
	});

	return (
		<div className={classes.wrapper}>
			<h1 className={classes.title}>Share Life</h1>
			<form className={classes.form}>
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
	);
}

export default Login;