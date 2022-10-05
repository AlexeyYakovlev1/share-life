import classes from "../../pages/Profile/Profile.module.sass";
import { ReactComponent as LikeIcon } from "../../assets/images/heart.svg";
import { ReactComponent as CommentsIcon } from "../../assets/images/comments.svg";
import React from "react";
import { Link } from "react-router-dom";
import getAllCommentsByPost from "../../http/comments/getAllCommentsByPost.http";
import AlertContext from "../../context/alert.context";
import { IPost } from "../../models/post.models";

function Post({ photos, id, owner_id, person_id_likes }: IPost): JSX.Element {
	const [hover, setHover] = React.useState<boolean>(false);
	const [commentsLength, setCommentsLength] = React.useState<number>(0);

	const { setText } = React.useContext(AlertContext);

	// get comments length
	React.useEffect(() => {
		getAllCommentsByPost(id)
			.then((data) => {
				const { success, error, comments } = data;

				if (!success) {
					setText(error);
					return;
				}

				setCommentsLength(comments.length);
			});
	}, [id]);

	return (
		<li
			onMouseEnter={() => setHover(!hover)}
			onMouseLeave={() => setHover(!hover)}
			style={{ backgroundImage: `url(${photos[0].base64})` }}
			className={classes.contentItem}
		>
			{hover && <Link to={`/profile/${owner_id}?watch=true&post_id=${id}`}>
				<div className={classes.contentItemInfo}>
					<span><LikeIcon /> {person_id_likes.length}</span>
					<span><CommentsIcon /> {commentsLength}</span>
				</div>
			</Link>}
		</li>
	);
}

export default Post;