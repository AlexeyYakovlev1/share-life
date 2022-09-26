import classes from "../../pages/Profile/Profile.module.sass";
import { ReactComponent as LikeIcon } from "../../assets/images/heart.svg";
import { ReactComponent as CommentsIcon } from "../../assets/images/comments.svg";
import React from "react";
import { Link } from "react-router-dom";
import getAllCommentsByPost from "../../http/comments/getAllCommentsByPost.http";
import AlertContext from "../../context/alert.context";
import { IPostPhoto } from "../../models/post.models";

interface IPostProps {
	photos: Array<IPostPhoto>;
	postId: number;
	ownerId: number;
}

function Post({ photos, postId, ownerId }: IPostProps): JSX.Element {
	const [hover, setHover] = React.useState<boolean>(false);
	const [commentsLength, setCommentsLength] = React.useState<number>(0);

	const { setText } = React.useContext(AlertContext);

	// get comments length
	React.useEffect(() => {
		getAllCommentsByPost(postId)
			.then((data) => {
				const { success, error, comments } = data;

				if (!success) {
					setText(error);
					return;
				}

				setCommentsLength(comments.length);
			});
	}, [postId]);

	return (
		<li
			onMouseEnter={() => setHover(!hover)}
			onMouseLeave={() => setHover(!hover)}
			style={{ backgroundImage: `url(${photos[0].base64})` }}
			className={classes.contentItem}
		>
			{hover && <Link to={`/profile/${ownerId}?watch=true&post_id=${postId}`}>
				<div className={classes.contentItemInfo}>
					<span><LikeIcon /> {0}</span>
					<span><CommentsIcon /> {commentsLength}</span>
				</div>
			</Link>}
		</li>
	);
}

export default Post;