import React from "react";
import { Link, useParams } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import classes from "./Post.module.sass";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import "swiper/css";
import { ReactComponent as LikeIcon } from "../../assets/images/heart.svg";
import { ReactComponent as ThreeDotsIcon } from "../../assets/images/three_dots.svg";
import useLike from "../../hooks/post/useLike";
import Comment from "../../components/Comment/Comment";
import AddComment from "../../components/AddComment/AddComment";
import Button from "../../components/UI/Button/Button";
import { IState } from "../../models/redux.models";
import { useSelector } from "react-redux";
import PostMenu from "../../components/PostMenu/PostMenu";
import getDatePost from "../../utils/getDatePost.util";
import useTheme from "../../hooks/useTheme";
import cn from "classnames";
import useUser from "../../hooks/user/useUser";
import usePost from "../../hooks/post/usePost";
import useComments from "../../hooks/useComments";

function Post() {
	const { light, dark } = useTheme();
	const { id: currentUserId } = useSelector((state: IState) => state.person.info);
	const { id: postId } = useParams();

	const { post } = usePost(postId, postId, [postId]);
	const { user: owner, avatar } = useUser(post.id, post.owner_id, [post]);
	const { comments, setComments, viewComments, setViewComments } = useComments(post.id, post.id, [post]);

	const { likeClick, likesNum, putedLike } = useLike(post, owner);
	const [visible, setVisible] = React.useState<boolean>(false);
	const createdAt = getDatePost(post.date);

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