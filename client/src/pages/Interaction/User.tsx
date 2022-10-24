import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/UI/Button/Button";
import AlertContext from "../../context/alert.context";
import { IPerson } from "../../models/person.models";
import classes from "./Interaction.module.sass";
import { useSelector } from "react-redux";
import { IState } from "../../models/redux.models";
import { useFollow } from "../../hooks/useFollow";
import cn from "classnames";
import useTheme from "../../hooks/useTheme";
import useAvatar from "../../hooks/useAvatar";

function User({ user }: { user: IPerson }): JSX.Element {
	const { light, dark } = useTheme();
	const { setText } = React.useContext(AlertContext);
	const { id: currentIdUser } = useSelector((state: IState) => state.person.info);
	const [followUser, setFollowUser] = React.useState<boolean>(user.followers.includes(currentIdUser));
	const { followClick } = useFollow(+user.id, setText, setFollowUser);
	const avatar = useAvatar(user.avatar.base64);

	return (
		<li className={cn(classes.user, {
			[classes.light]: light,
			[classes.dark]: dark
		})}>
			<div className={classes.userLeft}>
				<div
					className={classes.userAvatar}
					style={{ backgroundImage: `url(${avatar})` }}
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