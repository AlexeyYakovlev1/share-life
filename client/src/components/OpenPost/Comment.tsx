import { Link } from "react-router-dom";
import { IComment } from "../../models/post.models";
import classes from "./OpenPost.module.sass";
import React from "react";
import getOneUser from "../../http/user/getOneUser.http";
import AlertContext from "../../context/alert.context";
import { IPerson } from "../../models/person.models";
import useAvatar from "../../hooks/useAvatar";

function Comment({ info }: { info: IComment }): JSX.Element {
	const { setText } = React.useContext(AlertContext);

	const [userComment, setUserComment] = React.useState<IPerson>({
		id: 1,
		user_name: "",
		full_name: "",
		email: "",
		avatar: {
			base64: "",
			filename: ""
		},
		password: "",
		description: "",
		roles: [""]
	});

	React.useEffect(() => {
		if (info.owner_id === -1) return;

		getOneUser(info.owner_id)
			.then((data) => {
				const { success, person, error } = data;

				if (!success) {
					setText(error);
					return;
				}

				setUserComment(person);
			});
	}, [info]);

	const createdAt = new Date(info.date).toLocaleDateString();

	return (
		<li className={classes.comment}>
			<div
				style={{ backgroundImage: `url(${useAvatar(userComment.avatar.base64)})` }}
				className={classes.commentAvatar}
			></div>
			<div className={classes.commentInfo}>
				<p className={classes.commentText}>
					<span className={classes.commentName}>
						<Link to={`/profile/${userComment.id}`}>
							{userComment.user_name}
						</Link>
					</span> {info.text}
				</p>
				<span className={classes.commentCreatedAt}>{createdAt}</span>
			</div>
		</li>
	);
}

export default Comment;