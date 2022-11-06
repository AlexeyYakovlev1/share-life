import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import AlertContext from "../../context/alert.context";
import getOnePost from "../../http/posts/getOnePost.http";
import { IComment, IPost } from "../../models/post.models";
import classes from "./Post.module.sass";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import "swiper/css";
import { IPerson } from "../../models/person.models";
import getOneUser from "../../http/user/getOneUser.http";
import useAvatar from "../../hooks/useAvatar";
import { ReactComponent as LikeIcon } from "../../assets/images/heart.svg";
import { ReactComponent as ThreeDotsIcon } from "../../assets/images/three_dots.svg";
import useLike from "../../hooks/useLike";
import getAllCommentsByPost from "../../http/comments/getAllCommentsByPost.http";
import Comment from "../../components/Comment/Comment";
import AddComment from "../../components/AddComment/AddComment";
import Button from "../../components/UI/Button/Button";
import { IState } from "../../models/redux.models";
import { useSelector } from "react-redux";
import PostMenu from "../../components/PostMenu/PostMenu";
import getDatePost from "../../utils/getDatePost.util";
import useTheme from "../../hooks/useTheme";
import cn from "classnames";

function Post() {
	const { light, dark } = useTheme();
	const { id: currentUserId } = useSelector((state: IState) => state.person.info);
	const { id: postId } = useParams();
	const [post, setPost] = React.useState<IPost>({
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
	const { setText } = React.useContext(AlertContext);
	const navigate = useNavigate();
	const [owner, setOwner] = React.useState<IPerson>({
		id: -1,
		full_name: "",
		user_name: "",
		email: "",
		avatar: {
			base64: "",
			filename: ""
		},
		password: "",
		description: "",
		roles: [""],
		followers: [],
		following: []
	});
	const [avatar, setAvatar] = React.useState<string>(useAvatar(owner.avatar.base64));
	const { likeClick, likesNum, putedLike } = useLike(post, owner);
	const [comments, setComments] = React.useState<Array<IComment>>([]);
	const [viewComments, setViewComments] = React.useState<boolean>(comments.length >= 3);
	const [visible, setVisible] = React.useState<boolean>(false);
	const createdAt = getDatePost(post.date);

	// get owner
	React.useEffect(() => {
		if (post.id === -1) return;

		getOneUser(+post.owner_id)
			.then((data) => {
				const { success, message, error, person } = data;

				if (!success) {
					setText(message || error);
					navigate("/");
					return;
				}

				setOwner(person);
				setAvatar(useAvatar(person.avatar.base64));
			});
	}, [post]);

	// get post
	React.useEffect(() => {
		if (!postId) return;

		getOnePost(+postId)
			.then((data) => {
				const { message, success, error, post: postFromServer } = data;
				if (!success) {
					setText(message || error);
					navigate("/");
					return;
				}

				setPost(postFromServer);
			});
	}, [postId]);

	// get comments
	React.useEffect(() => {
		if (post.id === -1) return;

		getAllCommentsByPost(+post.id)
			.then((data) => {
				const { success, message, error, comments } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				setComments(comments);
				setViewComments(comments.length >= 3);
			});
	}, [post]);

	return (
		<MainLayout>
			<article className={cn(classes.wrapper, {
				[classes.light]: light,
				[classes.dark]: dark
			})}>
				<header className={classes.header}>
					<div className={classes.headerUser}>
						<div
							style={{ backgroundImage: `url(${avatar})` }}
							className={classes.headerUserAvatar}
						></div>
						<div className={classes.headerUserInfo}>
							<Link to={`/profile/${owner.id}`}>{owner.user_name}</Link>
							<span className={classes.userInfoLocation}>{post.location}</span>
							<span className={classes.userInfoDate}>{createdAt}</span>
						</div>
					</div>
					{+currentUserId === +owner.id && <div className={classes.headerSettings}>
						<button
							className={classes.headerSettingsBtn}
							onClick={() => setVisible(!visible)}
						>
							<ThreeDotsIcon />
						</button>
						{visible &&
							<PostMenu
								post={post}
								setVisible={setVisible}
								visible={visible}
								className={classes.headerSettingsMenu}
							/>}
					</div>}
				</header>
				<div className={classes.body}>
					<div className={classes.bodySliderWrapper}>
						<Swiper
							className={classes.bodySlider}
							slidesPerView={1}
						>
							{post.photos.map((photo, index) => {
								return (
									<SwiperSlide
										className={classes.bodySliderItem}
										key={`${photo.filename}_${index}`}
									>
										<img src={photo.base64} alt="photo" />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</div>
					<p className={classes.bodyDescription}>{post.description}</p>
					<footer className={classes.bodyDown}>
						<button
							onClick={likeClick}
							className={classes.bodyDownLike}
						>
							<LikeIcon className={
								putedLike.puted ? classes.svgLikeActive : classes.svgLike
							} />
						</button>
						<span className={classes.bodyDownLikesNum}>{likesNum} лайков</span>
					</footer>
				</div>
				<div className={classes.comments}>
					<AddComment
						postId={post.id}
						className={classes.formComment}
						comments={comments}
						setComments={setComments}
					/>
					{viewComments &&
						<Button
							className={classes.bodyDescriptionMore}
							onClick={() => setViewComments(!viewComments)}
						>
							Смотреть все {comments.length} комментарии
						</Button>
					}
					<ul className={classes.commentsList}>
						{comments.map((_, index) => {
							if (viewComments && index >= 2) return;
							const comment = comments[index];
							return <Comment key={comment.id} info={comment} />;
						})}
					</ul>
				</div>
			</article>
		</MainLayout>
	);
}

export default Post;