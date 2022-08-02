import { Link } from "react-router-dom";
import { IComment } from "../../models/post.models";
import classes from "./OpenPost.module.sass";

function Comment({ info }: { info: IComment }): JSX.Element {
	const userComment = {
		id: 1,
		userName: "alexey",
		fullName: "Petr Maksimov",
		email: "petr@gmail.com",
		avatar: "https://64.media.tumblr.com/ed2ab2416407afc0d3fbb262bbb3f60b/1b0bdac815cbd792-48/s250x400/621b6be33a6f52d663517b229fdc49ed0166d2f5.png"
	};

	return (
		<li className={classes.comment}>
			<img
				className={classes.commentAvatar}
				src={userComment.avatar}
				alt={userComment.userName}
			/>
			<div className={classes.commentInfo}>
				<p className={classes.commentText}>
					<span className={classes.commentName}>
						<Link to={`/profile/${userComment.id}`}>
							{userComment.userName}
						</Link>
					</span> {info.text}
				</p>
				<span className={classes.commentCreatedAt}>{info.createdAt.toString()}</span>
			</div>
		</li>
	);
}

export default Comment;