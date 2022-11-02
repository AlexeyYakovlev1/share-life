import { IComment, IPost } from "../../models/post.models";
import classes from "./OpenPost.module.sass";
import { ReactComponent as ThreeDotsIcon } from "../../assets/images/three_dots.svg";
import { ReactComponent as LikeIcon } from "../../assets/images/heart.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import Comment from "./Comment";
import cn from "classnames";
import AddComment from "../AddComment/AddComment";
import React from "react";
import PostMenu from "../PostMenu/PostMenu";
import { IPerson } from "../../models/person.models";
import getOneUser from "../../http/user/getOneUser.http";
import AlertContext from "../../context/alert.context";
import getOnePost from "../../http/posts/getOnePost.http";
import useAvatar from "../../hooks/useAvatar";
import getAllCommentsByPost from "../../http/comments/getAllCommentsByPost.http";
import { IState } from "../../models/redux.models";
import { useSelector } from "react-redux";
import getDatePost from "../../utils/getDatePost.util";
import checkFollow from "../../http/follow/checkFollow.http";
import useTheme from "../../hooks/useTheme";
import useLike from "../../hooks/useLike";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import "swiper/css";

function OpenPost({ ownerId }: { ownerId: number }): JSX.Element {
	const currentUser = useSelector((state: IState) => state.person.info);
	const { light, dark } = useTheme();

	const [currentPost, setCurrentPost] = React.useState<IPost>({
		id: -1,
		owner_id: -1,
		person_id_likes: [],
		location: "",
		photos: [{
			base64: "",
			filename: ""
		}],
		description: "",
		date: ""
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
		description: "",
		followers: [],
		following: []
	});
	const [visible, setVisible] = React.useState<boolean>(false);
	const [commentsPost, setCommentsPost] = React.useState<Array<IComment>>([]);
	const [followUser, setFollowUser] = React.useState<boolean>(userPost.followers.includes(+currentUser.id));

	const [searchParams, setSearchParams] = useSearchParams();
	const queryPostId = searchParams.get("post_id");

	const navigate = useNavigate();
	const { setText } = React.useContext(AlertContext);
	const { likeClick, likesNum, putedLike } = useLike(currentPost, setText, currentUser);

	// comments
	React.useEffect(() => {
		if (currentPost.id === -1) return;

		getAllCommentsByPost(currentPost.id)
			.then((data) => {
				const { comments, success, error } = data;

				if (!success) {
					setText(error);
					return;
				}

				setCommentsPost(comments);
			});
	}, [currentPost]);

	// post
	React.useEffect(() => {
		if (queryPostId && +queryPostId > 0) {
			getOnePost(+queryPostId)
				.then((data) => {
					const { success, message, post, error } = data;

					setText(message || error);

					if (!success) {
						navigate(`/profile/${userPost.id}`);
						return;
					}

					setCurrentPost(post);
				});
		}
	}, [queryPostId]);

	// user
	React.useEffect(() => {
		if (ownerId > 0) {
			getOneUser(ownerId)
				.then((data) => {
					const { success, person, message, error } = data;
					setText(message || error);

					if (!success) return;
					setUserPost({ ...person, avatar: useAvatar(person.avatar) });
				});
			checkFollow(+ownerId)
				.then((data) => {
					const { success } = data;

					if (!success) return;

					setFollowUser(data.follow);
				});
		}
	}, [ownerId]);

	const createdAt = getDatePost(currentPost.date);

	return (
		<div
			className={cn(classes.content, {
				[classes.light]: light,
				[classes.dark]: dark
			})}
			onClick={event => event.stopPropagation()}
		>
			<div className={classes.left}>
				<Swiper
					className={classes.bodyPhotosList}
					spaceBetween={50}
					slidesPerView={1}
				>
					{currentPost.photos.map((photo, index) => {
						return (
							<SwiperSlide
								className={classes.bodyPhotosListItem}
								key={`${photo.filename}_${index}`}
							>
								<img src={photo.base64} alt="photo" />
							</SwiperSlide>
						);
					})}
				</Swiper>
				{/* <ul
					className={classes.leftList}
					style={{ width: `${widthSlider * currentPost.photos.length}px` }}
				>
					{currentPost.photos.map((photo, index) => (
						<li
							className={classes.leftListItem}
							key={`${photo.filename}_${index + 1}`}
							style={{
								width: `${widthSlider}px`,
								height: "100%",
								transform: `translate(-${count * widthSlider}px)`,
								backgroundImage: `url(${photo.base64})`
							}}
						></li>
					))}
				</ul> */}
			</div>
			<div className={classes.info}>
				<header className={classes.infoHeader}>
					<div className={classes.infoHeaderDescription}>
						<div
							className={classes.avatar}
							style={{ backgroundImage: `url(${userPost.avatar.base64})` }}
						></div>
						<div className={classes.infoUser}>
							<div className={classes.infoUserLeft}>
								<span className={classes.infoUserName}>{userPost.user_name}&nbsp;</span>
								{+currentUser.id !== +userPost.id &&
									<span className={classes.infoUserFollowing}>
										&#x2022;&nbsp;{followUser ? "Following" : "Not followed"}
									</span>
								}
							</div>
							<span className={classes.location}>{currentPost.location}</span>
						</div>
					</div>
					{+currentUser.id === +userPost.id && <div className={classes.infoSettings}>
						<button
							onClick={() => setVisible(!visible)}
							className={cn(classes.infoSettingsBtn, classes.threeDots)}
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
					</div>}
				</header>
				<div className={classes.infoBody}>
					<div className={classes.infoComments}>
						<ul className={classes.infoCommentsList}>
							{commentsPost.length ? commentsPost.map((comment: IComment) => (
								<Comment key={comment.id} info={comment} />
							)) : <span>No comments</span>}
						</ul>
					</div>
					<div className={classes.infoActions}>
						<div className={classes.infoActionsTop}>
							<div className={classes.infoActionsBtns}>
								<button
									onClick={likeClick}
									className={classes.infoActionsLike}
								>
									<LikeIcon className={
										putedLike.puted ? classes.svgLikeActive : classes.svgLike
									} />
								</button>
							</div>
							<span className={classes.infoActionsLikesNum}>{likesNum} likes</span>
							<span className={classes.infoActionsCreatedAt}>{createdAt}</span>
						</div>
						<AddComment
							postId={currentPost.id}
							comments={commentsPost}
							setComments={setCommentsPost}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default OpenPost;