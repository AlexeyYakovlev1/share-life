import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/UI/Button/Button";
import AlertContext from "../../context/alert.context";
import { IPerson } from "../../models/person.models";
import classes from "./Interaction.module.sass";
import { useSelector } from "react-redux";
import { IState } from "../../models/redux.models";
import { useFollow } from "../../hooks/useFollow";

function User({ user }: { user: IPerson }): JSX.Element {
	const { setText } = React.useContext(AlertContext);
	const { id: currentIdUser } = useSelector((state: IState) => state.person.info);
	const [followUser, setFollowUser] = React.useState<boolean>(user.followers.includes(currentIdUser));
	const { followClick } = useFollow(+user.id, setText, setFollowUser);

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
			{+user.id !== +currentIdUser ? <Button
				onClick={followClick}
			>
				{followUser ? "Unfollow" : "Follow"}
			</Button> : <Button>
				<Link to={`/profile/${user.id}`}>View</Link>
			</Button>}
		</li>
	);
}

export default User;