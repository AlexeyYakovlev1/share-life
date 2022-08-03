import { IPost } from "../../models/post.models";
import classes from "./HomePost.module.sass";
import { ReactComponent as ThreeDotsIcon } from "../../assets/images/three_dots.svg";
import { ReactComponent as LikeIcon } from "../../assets/images/heart.svg";
import AddComment from "../AddComment/AddComment";
import { Link } from "react-router-dom";
import cn from "classnames";
import React from "react";
import Button from "../UI/Button/Button";

function HomePost({ info }: { info: IPost }): JSX.Element {
	const userPost = {
		id: 2,
		userName: "quod_42",
		fullName: "Alexey Yakovlev",
		email: "alex@gmail.com",
		avatar: "https://image.api.playstation.com/cdn/EP1965/CUSA05528_00/pImhj205rhCZ3oHbfkKZzvvFL2S3IyL7.png?w=960&h=960"
	};
	const [dotsToEnd, setDotsToEnd] = React.useState<boolean>(info.description ? info.description.trim().length >= 200 : false);

	return (
		<li className={classes.post}>
			<header className={classes.header}>
				<div className={classes.headerLeft}>
					<img
						className={classes.avatar}
						src={userPost.avatar}
						alt={userPost.userName}
					/>
					<div className={classes.headerInfo}>
						<span className={classes.headerName}>
							<Link to={`/profile/${userPost.id}`}>{userPost.userName}</Link>
						</span>
						<span className={classes.headerLocation}>{info.location}</span>
					</div>
				</div>
				<button className={classes.headerSettings}>
					<ThreeDotsIcon />
				</button>
			</header>
			<div className={classes.body}>
				<img
					src={info.photos[0]}
					alt={info.description}
				/>
				<div className={classes.bodyDescription}>
					<div className={classes.bodyDescriptionTop}>
						<div className={classes.bodyDescriptionBtns}>
							<button
								className={cn(classes.bodyDescriptionLike, {
									[classes.bodyDescriptionLikeActive]: true
								})}
							>
								<LikeIcon />
							</button>
						</div>
						<span className={classes.bodyDescriptionLikesNum}>
							{info.usersLikesIds.length} likes
						</span>
						<div>
							<p
								className={cn(classes.bodyDescriptionText, {
									[classes.bodyDescriptionTextHideSide]: dotsToEnd
								})}
							>
								<span className={classes.headerName}>{userPost.userName}</span>
								&nbsp;
								{info.description}
							</p>
							{dotsToEnd && <Button
								className={classes.bodyDescriptionMore}
								onClick={() => setDotsToEnd(!dotsToEnd)}
							>
								React more
							</Button>}
							{dotsToEnd && <Button
								className={classes.bodyDescriptionMore}
								onClick={() => setDotsToEnd(!dotsToEnd)}
							>
								View {info.usersCommentsIds.length} comments
							</Button>}
						</div>
					</div>
					<AddComment className={classes.formComment} />
				</div>
			</div>
		</li>
	);
}

export default HomePost;