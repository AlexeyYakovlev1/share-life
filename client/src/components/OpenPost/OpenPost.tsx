import { IComment, IPost } from "../../models/post.models";
import classes from "./OpenPost.module.sass";
import { ReactComponent as ThreeDotsIcon } from "../../assets/images/three_dots.svg";
import { ReactComponent as LikeIcon } from "../../assets/images/heart.svg";
import { ReactComponent as ArrowLeftIcon } from "../../assets/images/arrow-left.svg";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Comment from "./Comment";
import cn from "classnames";
import AddComment from "../AddComment/AddComment";
import { useSlider } from "../../hooks/useSlider";
import React from "react";
import PostMenu from "../PostMenu/PostMenu";
import { IPerson } from "../../models/person.models";
import getOneUser from "../../http/user/getOneUser.http";
import AlertContext from "../../context/alert.context";
import LoaderContext from "../../context/loader.context";
import getOnePost from "../../http/posts/getOnePost.http";
import useAvatar from "../../hooks/useAvatar";

function OpenPost({ ownerId }: { ownerId: number }): JSX.Element {
	const [currentPost, setCurrentPost] = React.useState<IPost>({
		id: -1,
		owner_id: -1,
		photos: [""],
		description: ""
	});
	const [userPost, setUserPost] = React.useState<IPerson>({
		id: -1,
		user_name: "",
		full_name: "",
		email: "",
		avatar: {
			base64: "",
			filename: ""
		},
		password: "",
		roles: [""],
		description: ""
	});
	const [visible, setVisible] = React.useState<boolean>(false);
	const [commentsPost, setCommentsPost] = React.useState<Array<IComment>>([]);

	const isTrue = true;
	const location = useLocation();

	const [searchParams, setSearchParams] = useSearchParams();
	const queryWatch = searchParams.get("watch") === "true";
	const queryPostId = searchParams.get("post_id");

	const navigate = useNavigate();
	const { setCount, sliderWrapperRef, count, widthSlider } = useSlider({ list: currentPost.photos });

	const { setText } = React.useContext(AlertContext);
	const { setLoad } = React.useContext(LoaderContext);

	// post
	React.useEffect(() => {
		if (queryPostId) {
			if (+queryPostId > 0) {
				setLoad(true);
				getOnePost(+queryPostId)
					.then((data) => {
						const { success, message, post, error } = data;

						setText(message || error);

						if (!success) {
							setLoad(false);
							return;
						}

						setCurrentPost(post);
					});
				setLoad(false);
			}
		}
	}, [queryPostId]);

	// user
	React.useEffect(() => {
		if (ownerId > 0) {
			setLoad(true);
			getOneUser(ownerId)
				.then((data) => {
					const { success, person, message, error } = data;

					setText(message || error);

					if (!success) {
						setLoad(false);
						return;
					}

					setUserPost({ ...person, avatar: useAvatar(person.avatar) });
				});
			setLoad(false);
		}
	}, [ownerId]);

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
						{currentPost.photos.map((photo, index) => (
							<li
								className={classes.leftListItem}
								key={`${photo[photo.length - 2]}_${index + 1}`}
								style={{
									width: `${widthSlider}px`,
									height: "100%",
									transform: `translate(-${count * widthSlider}px)`,
									backgroundImage: `url(${photo})`
								}}
							></li>
						))}
					</ul>
				</div>
				<div className={classes.info}>
					<header className={classes.infoHeader}>
						<div className={classes.infoHeaderDescription}>
							<img
								className={classes.avatar}
								src={userPost.avatar.base64}
								alt={userPost.user_name}
							/>
							<div className={classes.infoUser}>
								<div>
									<span className={classes.infoUserName}>{userPost.user_name} &#x2022;</span>
									<span className={classes.infoUserFollowing}>
										&nbsp;{isTrue ? "Following" : "Not followed"}
									</span>
								</div>
								<span className={classes.location}>{currentPost.location}</span>
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
								{commentsPost.length ? commentsPost.map((comment: IComment) => (
									<Comment key={comment.id} info={comment} />
								)) : <span>No comments...</span>}
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