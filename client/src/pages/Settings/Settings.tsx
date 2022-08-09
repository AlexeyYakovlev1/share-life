import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import classes from "./Settings.module.sass";

function Settings(): JSX.Element {
	const user = {
		id: 2,
		userName: "quod_42",
		fullName: "Alexey Yakovlev",
		email: "alex@gmail.com",
		avatar: "https://image.api.playstation.com/cdn/EP1965/CUSA05528_00/pImhj205rhCZ3oHbfkKZzvvFL2S3IyL7.png?w=960&h=960",
		description: "Front-end developer"
	};
	const avatarRef = React.useRef<HTMLInputElement | null>(null);

	return (
		<MainLayout>
			<div className={classes.wrapper}>
				<div className={classes.user}>
					<img
						src={user.avatar}
						alt={user.userName}
					/>
					<div className={classes.userInfo}>
						<span className={classes.userInfoName}>
							<Link to={`/profile/${user.id}`}>{user.userName}</Link>
						</span>
						<input
							type="file"
							style={{ display: "none" }}
							ref={avatarRef}
							accept="image/*"
						/>
						<Button
							className={classes.userInfoChangeAvatarBtn}
							onClick={() => avatarRef.current?.click()}
						>
							Change Profile Photo
						</Button>
					</div>
				</div>
				<form className={classes.form}>
					<div className={classes.formInputBlock}>
						<label htmlFor="fullName">Full Name</label>
						<Input
							id="fullName"
							type="text"
							defaultValue={user.fullName}
						/>
					</div>
					<div className={classes.formInputBlock}>
						<label htmlFor="userName">User Name</label>
						<Input
							id="userName"
							type="text"
							defaultValue={user.userName}
						/>
					</div>
					<div className={classes.formInputBlock}>
						<label htmlFor="description">Description</label>
						<textarea
							id="description"
							defaultValue={user.description}
						/>
					</div>
					<div className={classes.formInputBlock}>
						<label htmlFor="email">Email</label>
						<Input
							id="email"
							type="text"
							defaultValue={user.email}
						/>
					</div>
					<Button className={classes.formSubmit}>Submit</Button>
				</form>
			</div>
		</MainLayout>
	);
}

export default Settings;