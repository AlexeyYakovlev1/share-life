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
import PostMenu from "../PostMenu/PostMenu";
import { IPerson } from "../../models/person.models";
import getOneUser from "../../http/user/getOneUser.http";
import AlertContext from "../../context/alert.context";
import useAvatar from "../../hooks/useAvatar";
import getAllCommentsByPost from "../../http/comments/getAllCommentsByPost.http";
import Comment from "../OpenPost/Comment";
import { useSelector } from "react-redux";
import { IState } from "../../models/redux.models";

function HomePost({ info }: { info: IPost }): JSX.Element {
	const [dotsToEnd, setDotsToEnd] = React.useState<boolean>(info.description ? info.description.trim().length >= 200 : false);
	const [comments, setComments] = React.useState<Array<any>>([]);
	const [viewComments, setViewComments] = React.useState<boolean>(comments.length >= 3);
	const [visible, setVisible] = React.useState<boolean>(false);
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
		description: "",
		roles: [""]
	});

	const currentUser = useSelector((state: IState) => state.person.info);
	const { setCount, count, sliderWrapperRef, widthSlider } = useSlider({ list: info.photos });
	const { setText } = React.useContext(AlertContext);

	// user
	React.useEffect(() => {
		getOneUser(info.owner_id)
			.then((data) => {
				const { success, message, person } = data;

				if (!success) {
					setText(message);
					return;
				}

				setUserPost(person);
			});
	}, [info]);

	// comments
	React.useEffect(() => {
		getAllCommentsByPost(info.id)
			.then((data) => {
				const { success, error, comments } = data;

				if (!success) {
					setText(error);
					return;
				}

				setComments(comments);
				setViewComments(comments.length >= 3);
			});
	}, [info]);

	return (
		<li className={classes.post}>
			<header className={classes.header}>
				<div className={classes.headerLeft}>
					<img
						className={classes.avatar}
						src={useAvatar(userPost.avatar.base64)}
						alt={userPost.user_name}
					/>
					<div className={classes.headerInfo}>
						<span className={classes.headerName}>
							<Link to={`/profile/${userPost.id}`}>{userPost.user_name}</Link>
						</span>
						<span className={classes.headerLocation}>{info.location}</span>
					</div>
				</div>
				{+currentUser.id === +userPost.id && <div className={classes.headerSettings}>
					<button
						className={classes.headerSettingsBtn}
						onClick={() => setVisible(!visible)}
					>
						<ThreeDotsIcon />
					</button>
					{visible &&
						<PostMenu
							post={info}
							setVisible={setVisible}
							visible={visible}
							className={classes.headerSettingsMenu}
						/>}
				</div>}
			</header>
			<div className={classes.body}>
				<div className={classes.bodyPhotos} ref={sliderWrapperRef}>
					{info.photos.length > 1 &&
						<React.Fragment>
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
						</React.Fragment>
					}
					<ul
						className={classes.bodyList}
						style={{ width: `${widthSlider * info.photos.length}px` }}
					>
						{info.photos.map((photo, index) => (
							<li
								className={classes.bodyListItem}
								key={`${photo[photo.length - 1]}${index}`}
								style={{
									width: `${widthSlider}px`,
									height: "530px",
									transform: `translate(-${count * widthSlider}px)`,
									backgroundImage: `url(${photo})`
								}}
							>
							</li>

						))}
					</ul>
				</div>
				<div className={classes.bodyDescription}>
					<div className={classes.bodyDescriptionBtns}>
						<button
							className={cn(classes.bodyDescriptionLike, {
								[classes.bodyDescriptionLikeActive]: false
							})}
						>
							<LikeIcon />
						</button>
					</div>
					<span className={classes.bodyDescriptionLikesNum}>
						{/* {info.usersLikesIds.length} likes */}
						{0} likes
					</span>
					<div>
						{info.description && <p
							className={cn(classes.bodyDescriptionText, {
								[classes.bodyDescriptionTextHideSide]: dotsToEnd
							})}
						>
							<span className={classes.headerName}>{userPost.user_name}</span>
							&nbsp;
							{info.description}
						</p>}
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
								View all {comments.length} comments
							</Button>}
						</div>
					</div>
				</div>
				<div className={classes.bodyComments} style={{ marginTop: `${comments.length ? "20px" : "0"}` }}>
					<ul className={classes.bodyCommentsList}>
						{comments.map((_, index: number) => {
							if (viewComments && index >= 2) return;

							const comment = comments[index];

							return <Comment key={`${comment.id}_${index}`} info={comment} />;
						})}
					</ul>
				</div>
				<AddComment postId={info.id} className={classes.formComment} comments={comments} setComments={setComments} />
			</div>
		</li>
	);
}

export default HomePost;