import classes from "../../pages/Profile/Profile.module.sass";
import { ReactComponent as LikeIcon } from "../../assets/images/heart.svg";
import { ReactComponent as CommentsIcon } from "../../assets/images/comments.svg";
import React from "react";
import { Link } from "react-router-dom";
import { IPost } from "../../models/post.models";
import useComments from "../../hooks/useComments";

interface IPostComponent extends IPost {
	photo: string;
}

function Post({ photo, id, person_id_likes }: IPostComponent): JSX.Element {
	const [hover, setHover] = React.useState<boolean>(false);
	const { comments } = useComments("NONE", id, [id]);

	return (
		<li
			onMouseEnter={() => setHover(!hover)}
			onMouseLeave={() => setHover(!hover)}
			style={{ backgroundImage: `url(${photo})` }}
			className={classes.contentItem}
		>
			{hover && <Link
				to={`/post/${id}`}
				className={classes.contentItemLink}
			>
				<div className={classes.contentItemInfo}>
					<span><LikeIcon /> {person_id_likes.length}</span>
					<span><CommentsIcon /> {comments.length}</span>
				</div>
			</Link>}
		</li>
	);
}

export default Post;