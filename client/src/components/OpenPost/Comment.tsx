import { Link } from "react-router-dom";
import { IComment } from "../../models/post.models";
import classes from "./OpenPost.module.sass";
import React from "react";
import getOneUser from "../../http/user/getOneUser.http";
import AlertContext from "../../context/alert.context";
import { IPerson } from "../../models/person.models";
import useAvatar from "../../hooks/useAvatar";
import Cookies from "js-cookie";
import { trackPromise } from "react-promise-tracker";
import { IState } from "../../models/redux.models";
import { useSelector } from "react-redux";

const { REACT_APP_API_URL } = process.env;

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
	const { id: currentPersonId } = useSelector((state: IState) => state.person.info);
	const commentOwnerId = info.owner_id;

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
	const checkOwner = +currentPersonId === +commentOwnerId;

	function removeComment() {
		trackPromise(fetch(`${REACT_APP_API_URL}/comments/remove/${info.id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${Cookies.get("token")}`
			}
		})
			.then((response) => response.json())
			.then((data) => {
				const { message, error } = data;

				setText(message || error);
			}));
	}

	return (
		<li className={classes.comment}>
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
						className={classes.commentRemove}
						onClick={removeComment}
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