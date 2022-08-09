import { IPost } from "../../models/post.models";
import classes from "./HomePost.module.sass";
import { ReactComponent as ThreeDotsIcon } from "../../assets/images/three_dots.svg";
import { ReactComponent as LikeIcon } from "../../assets/images/heart.svg";
import { ReactComponent as ArrowLeftIcon } from "../../assets/images/arrow-left.svg";
import AddComment from "../AddComment/AddComment";
import { Link } from "react-router-dom";
import cn from "classnames";
import React from "react";
import Button from "../UI/Button/Button";
import { useSlider } from "../../hooks/useSlider";

function HomePost({ info }: { info: IPost }): JSX.Element {
	const userPost = {
		id: 2,
		userName: "quod_42",
		fullName: "Alexey Yakovlev",
		email: "alex@gmail.com",
		avatar: "https://image.api.playstation.com/cdn/EP1965/CUSA05528_00/pImhj205rhCZ3oHbfkKZzvvFL2S3IyL7.png?w=960&h=960"
	};
	const [dotsToEnd, setDotsToEnd] = React.useState<boolean>(info.description ? info.description.trim().length >= 200 : false);
	const [viewComments, setViewComments] = React.useState<boolean>(!!info.usersCommentsIds.length);
	const [comments, setComments] = React.useState([
		{
			id: 1,
			ownerId: 3,
			userName: "aalex",
			text: "So cool",
			createdAt: "19:36"
		},
		{
			id: 2,
			ownerId: 4,
			userName: "otherguy",
			text: "Neverwinter is cool game",
			createdAt: "19:03"
		},
		{
			id: 3,
			ownerId: 53,
			userName: "quda",
			text: "Yes",
			createdAt: "13:36"
		},
		{
			id: 4,
			ownerId: 43,
			userName: "qwe]",
			text: "i write this comment for this post",
			createdAt: "19:39"
		}
	]);
	const { setCount, count, sliderWrapperRef, widthSlider } = useSlider({ list: info.photos });

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
				<div className={classes.bodyPhotos} ref={sliderWrapperRef}>
					<button
						className={cn(classes.bodySwitchBtn, classes.bodySwitchBtnLeft)}
						onClick={() => setCount(count - 1)}
					>
						<ArrowLeftIcon />
					</button>
					<button
						className={cn(classes.bodySwitchBtn, classes.bodySwitchBtnRight)}
						onClick={() => setCount(count + 1)}
					>
						<ArrowLeftIcon />
					</button>
					<ul
						className={classes.bodyList}
						style={{ width: `${widthSlider * info.photos.length}px` }}
					>
						{info.photos.map(photo => (
							<img
								key={photo}
								src={photo}
								style={{
									maxWidth: `${widthSlider}px`,
									height: "530px",
									transform: `translate(-${count * 100}%)`
								}}
							/>
						))}
					</ul>
				</div>
				<div className={classes.bodyDescription}>
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
						<div className={classes.bodyDescriptionActions}>
							{dotsToEnd && <Button
								className={classes.bodyDescriptionMore}
								onClick={() => setDotsToEnd(!dotsToEnd)}
							>
								Read more
							</Button>}
							{viewComments && <Button
								className={classes.bodyDescriptionMore}
								onClick={() => setViewComments(!viewComments)}
							>
								View {info.usersCommentsIds.length} comments
							</Button>}
						</div>
					</div>
				</div>
				<div className={classes.bodyComments}>
					<ul className={classes.bodyCommentsList}>
						{comments.map((_, index: number) => {
							if (viewComments && index >= 2) return;

							const comment = comments[index];

							return (
								<li
									key={comment.id}
									className={cn(classes.bodyCommentsItem, classes.bodyDescriptionText)}
								>
									<span className={classes.headerName}>
										<Link to={`/profile/${comment.ownerId}`}>{comment.userName}</Link>
									</span>
									&nbsp;
									{comment.text}
								</li>
							);
						})}
					</ul>
				</div>
				<AddComment className={classes.formComment} />
			</div>
		</li>
	);
}

export default HomePost;