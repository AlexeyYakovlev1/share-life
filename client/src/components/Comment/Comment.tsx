import { Link } from "react-router-dom";
import { IComment } from "../../models/post.models";
import classes from "./Comment.module.sass";
import React from "react";
import AlertContext from "../../context/alert.context";
import useAvatar from "../../hooks/user/useAvatar";
import { IState } from "../../models/redux.models";
import { useSelector } from "react-redux";
import removeComment from "../../http/comments/removeComment.http";
import useTheme from "../../hooks/useTheme";
import cn from "classnames";
import useUser from "../../hooks/user/useUser";

function Comment({ info }: { info: IComment }): JSX.Element {
	const { light, dark } = useTheme();

	const { setText } = React.useContext(AlertContext);
	const { user: userComment } = useUser(info.owner_id, info.owner_id, [info]);
	const { id: currentPersonId } = useSelector((state: IState) => state.person.info);
	const commentOwnerId = info.owner_id;

	const createdAt = new Date(info.date).toLocaleDateString();
	const checkOwner = +currentPersonId === +commentOwnerId;

	function removeCommentClick() {
		removeComment(info)
			.then((data) => {
				const { message, error } = data;

				setText(message || error);
			});
	}

	return (
		<li className={cn(classes.comment, {
			[classes.light]: light,
			[classes.dark]: dark
		})}>
			<div
				style={{ backgroundImage: `url(${useAvatar(userComment.avatar.base64)})` }}
				className={classes.commentAvatar}
			></div>
			<div className={classes.commentInfo}>
				<div className={classes.commentInfoWrapper}>
					<p className={classes.commentText}>
						<span className={classes.commentName}>
							<Link to={`/profile/${userComment.id}`}>
								{userComment.user_name}
							</Link>
						</span>
						&nbsp;
						{info.text}
					</p>
					{checkOwner && <span
						title="Remove comment"
						className={classes.commentRemove}
						onClick={removeCommentClick}
					>
						&#9587;
					</span>}
				</div>
				<span className={classes.commentCreatedAt}>{createdAt}</span>
			</div>
		</li>
	);
}

export default Comment;