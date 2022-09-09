import { Link } from "react-router-dom";
import { IComment } from "../../models/post.models";
import classes from "./OpenPost.module.sass";
import React from "react";
import getOneUser from "../../http/user/getOneUser.http";
import LoaderContext from "../../context/loader.context";
import AlertContext from "../../context/alert.context";
import { IPerson } from "../../models/person.models";
import useAvatar from "../../hooks/useAvatar";

function Comment({ info }: { info: IComment }): JSX.Element {
	const { setLoad } = React.useContext(LoaderContext);
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

		setLoad(true);
		getOneUser(info.owner_id)
			.then((data) => {
				const { success, person, error } = data;

				if (!success) {
					setLoad(false);
					setText(error);
					return;
				}

				setUserComment(person);
			});
		setLoad(false);
	}, [info]);

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
				<span className={classes.commentCreatedAt}>{"09.09.2022"}</span>
			</div>
		</li>
	);
}

export default Comment;