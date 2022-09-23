import { Link } from "react-router-dom";
import Button from "../../components/UI/Button/Button";
import { IPerson } from "../../models/person.models";
import classes from "./Interaction.module.sass";

function User({ user }: { user: IPerson }): JSX.Element {
	return (
		<li className={classes.user}>
			<div className={classes.userLeft}>
				<div
					className={classes.userAvatar}
					style={{ backgroundImage: `url(${user.avatar.base64})` }}
				></div>
				<div className={classes.userInfo}>
					<header className={classes.userInfoHeader}>
						<span className={classes.userName}>
							<Link to={`/profile/${user.id}`}>{user.user_name}</Link>
						</span>
						<span className={classes.userFullName}>{user.full_name}</span>
					</header>
					<p className={classes.userDescription}>{user.description}</p>
				</div>
			</div>
			<Button className={classes.userFollow}>Unfollow</Button>
		</li>
	);
}

export default User;