import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import classes from "./Auth.module.sass";

function Register() {
	const [user, setUser] = React.useState({
		fullName: "", userName: "", email: "", password: ""
	});

	return (
		<div className={classes.wrapper}>
			<h1 className={classes.title}>Share Life</h1>
			<form className={classes.form}>
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
				<Button className={classes.submit}>Sign up</Button>
			</form>
			<p className={classes.text}>
				Have an account? <Link to="/auth/login">Log in</Link>
			</p>
		</div>
	);
}

export default Register;