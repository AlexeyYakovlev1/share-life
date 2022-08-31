import { IComment } from "../../models/post.models";
import classes from "./OpenPost.module.sass";
import { ReactComponent as ThreeDotsIcon } from "../../assets/images/three_dots.svg";
import { ReactComponent as LikeIcon } from "../../assets/images/heart.svg";
import { ReactComponent as ArrowLeftIcon } from "../../assets/images/arrow-left.svg";
import { useLocation, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import cn from "classnames";
import AddComment from "../AddComment/AddComment";
import { useSlider } from "../../hooks/useSlider";
import React from "react";
import PostMenu from "../PostMenu/PostMenu";

function OpenPost({ postId }: { postId: string }): JSX.Element {
	const currentPost = {
		id: 4,
		owner_id: 1,
		photos: ["https://cdn2.unrealengine.com/nw-m21-bard-1920x1080-3c7e59ea31ec.jpg", "https://cdn.akamai.steamstatic.com/steam/apps/109600/ss_95fa23b07c9bca7ba1cf6941cf169c3df822b6bd.1920x1080.jpg?t=1655927857", "https://cdn.cloudflare.steamstatic.com/steam/apps/109600/ss_0e639f7e5af0ff5219efebd0110af7afe0799820.1920x1080.jpg?t=1655927857"],
		description: "New post from neverwinter"
	};
	const userPost = {
		id: 2,
		user_name: "quod_42",
		full_name: "Alexey Yakovlev",
		email: "alex@gmail.com",
		avatar: "https://image.api.playstation.com/cdn/EP1965/CUSA05528_00/pImhj205rhCZ3oHbfkKZzvvFL2S3IyL7.png?w=960&h=960"
	};
	const commentsPost: Array<IComment> = [
		{
			id: 1,
			owner_id: 1,
			post_id: 1,
			text: "So cool picture!",
			createdAt: "20:15"
		}
	];
	const isTrue = true;
	const location = useLocation();
	const query = new URLSearchParams(location.search);
	const queryWatch = Boolean(query.get("watch"));
	const navigate = useNavigate();
	const { setCount, sliderWrapperRef, count, widthSlider } = useSlider({ list: currentPost.photos });

	const [visible, setVisible] = React.useState<boolean>(false);

	function closePost() {
		const params = new URLSearchParams({ watch: `${!queryWatch}` });
		navigate({ pathname: location.pathname, search: params.toString() });
	}

	return (
		<div className={classes.wrapper} onClick={closePost}>
			<div className={classes.content} onClick={event => event.stopPropagation()}>
				<div className={classes.left} ref={sliderWrapperRef}>
					<button
						className={cn(classes.leftBtn, classes.leftBtnLeft)}
						onClick={() => setCount(count - 1)}
					>
						<ArrowLeftIcon />
					</button>
					<button
						className={cn(classes.leftBtn, classes.leftBtnRight)}
						onClick={() => setCount(count + 1)}
					>
						<ArrowLeftIcon />
					</button>
					<ul
						className={classes.leftList}
						style={{ width: `${widthSlider * currentPost.photos.length}px` }}
					>
						{currentPost.photos.map(photo => (
							<img
								key={photo}
								style={{
									maxWidth: `${widthSlider}px`,
									maxHeight: "100%",
									transform: `translate(-${count * 100}%)`
								}}
								src={photo}
								alt=""
							/>
						))}
					</ul>
				</div>
				<div className={classes.info}>
					<header className={classes.infoHeader}>
						<div className={classes.infoHeaderDescription}>
							<img
								className={classes.avatar}
								src={userPost.avatar}
								alt={userPost.user_name}
							/>
							<div className={classes.infoUser}>
								<div>
									<span className={classes.infoUserName}>{userPost.user_name} &#x2022;</span>
									<span className={classes.infoUserFollowing}>
										&nbsp;{isTrue ? "Following" : "Not followed"}
									</span>
								</div>
								<span className={classes.location}>Coupa Cafe - Ramona</span>
							</div>
						</div>
						<div className={classes.infoSettings}>
							<button
								onClick={() => setVisible(!visible)}
								className={classes.infoSettingsBtn}
							>
								<ThreeDotsIcon />
							</button>
							{visible &&
								<PostMenu
									post={currentPost}
									setVisible={setVisible}
									visible={visible}
								/>
							}
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
							<AddComment />
						</div>
					</div>
				</div>
			</div>
		</div >
	);
}

export default OpenPost;