import { IComment, IPost } from "../../models/post.models";
import classes from "./OpenPost.module.sass";
import { ReactComponent as ThreeDotsIcon } from "../../assets/images/three_dots.svg";
import { ReactComponent as LikeIcon } from "../../assets/images/heart.svg";
import { ReactComponent as ArrowLeftIcon } from "../../assets/images/arrow-left.svg";
import { useLocation, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import cn from "classnames";
import React from "react";

function OpenPost({ postId }: { postId: string }): JSX.Element {
	const currentPost = {
		id: 4,
		ownerId: 1,
		photos: ["https://cdn2.unrealengine.com/nw-m21-bard-1920x1080-3c7e59ea31ec.jpg", "https://cdn.akamai.steamstatic.com/steam/apps/109600/ss_95fa23b07c9bca7ba1cf6941cf169c3df822b6bd.1920x1080.jpg?t=1655927857", "https://cdn.cloudflare.steamstatic.com/steam/apps/109600/ss_0e639f7e5af0ff5219efebd0110af7afe0799820.1920x1080.jpg?t=1655927857"],
		description: "New post from neverwinter",
		usersLikesIds: [32, 20],
		usersCommentsIds: [1]
	};
	const userPost = {
		id: 2,
		userName: "quod_42",
		fullName: "Alexey Yakovlev",
		email: "alex@gmail.com",
		avatar: "https://image.api.playstation.com/cdn/EP1965/CUSA05528_00/pImhj205rhCZ3oHbfkKZzvvFL2S3IyL7.png?w=960&h=960"
	};
	const commentsPost: Array<IComment> = [
		{
			id: 1,
			ownerId: 1,
			text: "So cool picture!",
			createdAt: "20:15"
		},
		{
			id: 2,
			ownerId: 2,
			text: "you suck",
			createdAt: "21:32"
		},
		{
			id: 3,
			ownerId: 1,
			text: "lorem ipsum dolor sit am, lorem ipsum dolor sit am!!!",
			createdAt: "09:21"
		},
		{
			id: 4,
			ownerId: 2,
			text: "So good",
			createdAt: "17:02"
		}
	];
	const isTrue = true;
	const location = useLocation();
	const query = new URLSearchParams(location.search);
	const queryWatch = Boolean(query.get("watch"));
	const navigate = useNavigate();
	const queryPostId: any = query.get("post_id");
	const [currentPostId, setCurrentPostId] = React.useState<number>(+queryPostId);

	function closePost() {
		const params = new URLSearchParams({ watch: `${!queryWatch}` });
		navigate({ pathname: location.pathname, search: params.toString() });
	}

	function switchPost(side: "LEFT" | "RIGHT") {
		if (side === "LEFT") {
			setCurrentPostId(currentPostId - 1);
		} else if (side === "RIGHT") {
			setCurrentPostId(currentPostId + 1);
		}
	}

	return (
		<div className={classes.wrapper} onClick={closePost}>
			<div className={classes.content} onClick={event => event.stopPropagation()}>
				<div className={classes.switchPost}>
					<button
						className={cn(classes.switchBtn, classes.switchLeft)}
						onClick={() => switchPost("LEFT")}
					>
						<ArrowLeftIcon />
					</button>
					<button
						className={cn(classes.switchBtn, classes.switchRight)}
						onClick={() => switchPost("RIGHT")}
					>
						<ArrowLeftIcon />
					</button>
				</div>
				<div className={classes.left}>
					<div
						className={classes.photo}
						style={{ backgroundImage: `url(${currentPost.photos[0]}` }}
					></div>
				</div>
				<div className={classes.info}>
					<header className={classes.infoHeader}>
						<div className={classes.infoHeaderDescription}>
							<img
								className={classes.avatar}
								src={userPost.avatar}
								alt={userPost.userName}
							/>
							<div className={classes.infoUser}>
								<div>
									<span className={classes.infoUserName}>{userPost.userName} &#x2022;</span>
									<span className={classes.infoUserFollowing}>&nbsp;{isTrue ? "Following" : "Not followed"}</span>
								</div>
								<span className={classes.location}>Coupa Cafe - Ramona</span>
							</div>
						</div>
						<div>
							<button className={classes.infoBtnSettings}>
								<ThreeDotsIcon />
							</button>
						</div>
					</header>
					<div className={classes.infoBody}>
						<div className={classes.infoComments}>
							<ul className={classes.infoCommentsList}>
								{commentsPost.map((comment: IComment) => (
									<Comment key={comment.id} info={comment} />
								))}
							</ul>
						</div>
						<div className={classes.infoActions}>
							<div className={classes.infoActionsTop}>
								<div className={classes.infoActionsBtns}>
									<button
										className={cn(classes.infoActionsLike, {
											[classes.infoActionsLikeActive]: isTrue
										})}
									>
										<LikeIcon />
									</button>
								</div>
								<span className={classes.infoActionsLikesNum}>1,085 likes</span>
								<span className={classes.infoActionsCreatedAt}>March 26</span>
							</div>
							<form className={classes.infoActionsForm}>
								<Input
									placeholder="Add a comment..."
								/>
								<Button>Post</Button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div >
	);
}

export default OpenPost;