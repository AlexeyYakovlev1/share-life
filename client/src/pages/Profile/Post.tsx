import classes from "../../pages/Profile/Profile.module.sass";
import { ReactComponent as LikeIcon } from "../../assets/images/heart.svg";
import { ReactComponent as CommentsIcon } from "../../assets/images/comments.svg";
import React from "react";
import { Link } from "react-router-dom";

interface IPostProps {
	photos: Array<string>;
	postId: number;
	ownerId: number;
}

function Post({ photos, postId, ownerId }: IPostProps): JSX.Element {
	const [hover, setHover] = React.useState<boolean>(false);

	return (
		<li
			onMouseEnter={() => setHover(!hover)}
			onMouseLeave={() => setHover(!hover)}
			style={{ backgroundImage: `url(${photos[0]})` }}
			className={classes.contentItem}
		>
			{hover && <Link to={`/profile/${ownerId}?watch=true&post_id=${postId}`}>
				<div className={classes.contentItemInfo}>
					<span><LikeIcon /> {0}</span>
					<span><CommentsIcon /> {0}</span>
				</div>
			</Link>}
		</li>
	);
}

export default Post;