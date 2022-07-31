import classes from "../../pages/Profile/Profile.module.sass";
import { ReactComponent as LikeIcon } from "../../assets/images/heart.svg";
import { ReactComponent as CommentsIcon } from "../../assets/images/comments.svg";
import React from "react";
import { Link } from "react-router-dom";

interface IPostProps {
	photos: Array<string>;
	comments: number;
	likes: number;
}

function Post({ photos, comments, likes }: IPostProps): JSX.Element {
	const [hover, setHover] = React.useState<boolean>(false);

	return (
		<li
			onMouseEnter={() => setHover(!hover)}
			onMouseLeave={() => setHover(!hover)}
			style={{ backgroundImage: `url(${photos[0]})` }}
			className={classes.contentItem}
		>
			{hover && <Link to={`/profile/${2}?watch=true&post_id=4`}>
				<div className={classes.contentItemInfo}>
					<span><LikeIcon /> {likes}</span>
					<span><CommentsIcon /> {comments}</span>
				</div>
			</Link>}
		</li>
	);
}

export default Post;