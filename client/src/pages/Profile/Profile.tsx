import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import { IPost } from "../../models/post.models";
import classes from "./Profile.module.sass";
import React from "react";
import { ReactComponent as ArrowLeftIcon } from "../../assets/images/arrow-left.svg";
import cn from "classnames";
import { useSlider } from "../../hooks/useSlider";
import AlertContext from "../../context/alert.context";
import { IPerson } from "../../models/person.models";
import getOneUser from "../../http/user/getOneUser.http";
import useAvatar from "../../hooks/useAvatar";
import { IState } from "../../models/redux.models";
import { useSelector } from "react-redux";
import { useFollow } from "../../hooks/useFollow";
import useTheme from "../../hooks/useTheme";
import { Suspense } from "react";
import OpenPostLoading from "../../components/Loading/OpenPost/OpenPostLoading";
import ProfilePostLoading from "../../components/Loading/ProfilePost/ProfilePostLoading";

function Profile(): JSX.Element {
	const OpenPost = React.lazy(() => import("../../components/OpenPost/OpenPost"));
	const Post = React.lazy(() => import("./Post"));

	const { light, dark } = useTheme();
	const [pageUser, setPageUser] = React.useState<IPerson>({
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

	const { id: currentIdUser } = useSelector((state: IState) => state.person.info);
	const posts = useSelector((state: IState) => state.posts);
	const userPosts = posts.filter((post: IPost) => +post.owner_id === +pageUser.id);

	const [currentUser, setCurrentUser] = React.useState<boolean>(false);
	const [followUser, setFollowUser] = React.useState<boolean>(pageUser.followers.includes(currentIdUser));

	const pageAvatarUser = useAvatar(pageUser.avatar.base64);
	const [searchParams, setSearchParams] = useSearchParams();
	const queryWatch = searchParams.get("watch") === "true";
	const queryPostOpen = searchParams.get("watch") === "true";
	const queryPostId = searchParams.get("post_id");
	const { setCount, count } = useSlider({ list: posts });
	const { id: pageIdUser } = useParams();
	const { setText } = React.useContext(AlertContext);
	const navigate = useNavigate();

	const { followClick } = useFollow(+pageUser.id, setText, setFollowUser);

	React.useEffect(() => {
		if (pageIdUser) {
			getOneUser(+pageIdUser)
				.then((data: any) => {
					const { success, person, message } = data;

					if (!success) {
						setText(message);
						navigate("/");
						return;
					}

					setPageUser(person);
					setCurrentUser(+pageIdUser === +currentIdUser);
				});
		}
	}, [pageIdUser, currentIdUser, followUser]);

	React.useEffect(() => {
		if (posts[count] && queryPostOpen) {
			setSearchParams({ watch: `${queryPostOpen}`, post_id: `${posts[count].id}` });
		}
	}, [count]);

	React.useEffect(() => {
		if (queryPostId) {
			setCount(posts.findIndex(item => item.id === +queryPostId));
		}
	}, [queryPostId]);

	function closePost() {
		const params = new URLSearchParams({ watch: `${!queryWatch}` });
		navigate({ pathname: location.pathname, search: params.toString() });
	}

	return (
		<MainLayout>
			<div className={cn(classes.wrapper, {
				[classes.light]: light,
				[classes.dark]: dark
			})}>
				{queryPostOpen &&
					<React.Fragment>
						{userPosts.length > 1 && <div className={classes.switchPost}>
							<button
								className={cn(classes.switchBtn, classes.switchLeft)}
								onClick={() => setCount(count - 1)}
							>
								<ArrowLeftIcon />
							</button>
							<button
								className={cn(classes.switchBtn, classes.switchRight)}
								onClick={() => setCount(count + 1)}
							>
								<ArrowLeftIcon />
							</button>
						</div>}
						<div className={classes.modalWrapper} onClick={closePost}>
							<Suspense fallback={<OpenPostLoading />}>
								<OpenPost ownerId={pageUser.id} />
							</Suspense>
						</div>
					</React.Fragment>
				}
				<div className={classes.top}>
					<div
						className={classes.avatar}
						style={{ backgroundImage: `url(${pageAvatarUser})` }}
					></div>
					<div className={classes.info}>
						<div className={classes.infoTop}>
							<span className={classes.name}>{pageUser.user_name}</span>
							{!currentUser
								?
								<Button
									onClick={followClick}
									className={classes.infoTopButton}
								>
									{followUser ? "Unfollow" : "Follow"}
								</Button>
								:
								<Button className={classes.infoTopButton}>
									<Link to="/settings">Settings</Link>
								</Button>
							}
						</div>
						<div className={classes.infoNums}>
							<ul className={classes.infoNumsList}>
								<li className={classes.infoNumsItem}>
									<span>
										<Link to="/"><strong>{userPosts.length}</strong> post</Link>
									</span>
								</li>
								<li className={classes.infoNumsItem}>
									<span>
										<Link to={`/interaction/${pageUser.id}?followers=y`}>
											<strong>{pageUser.followers.length}</strong> followers
										</Link>
									</span>
								</li>
								<li className={classes.infoNumsItem}>
									<span>
										<Link to={`/interaction/${pageUser.id}?following=y`}>
											<strong>{pageUser.following.length}</strong> following
										</Link>
									</span>
								</li>
							</ul>
						</div>
						<div className={classes.infoDescription}>
							<p className={classes.infoDescriptionText}>
								{pageUser.description}
							</p>
						</div>
					</div>
				</div>
				<div className={classes.content}>
					{
						userPosts.length ?
							<ul className={classes.contentList}>
								{userPosts.map((post: IPost) => {
									return (
										<Suspense
											key={post.id}
											fallback={<ProfilePostLoading />}
										>
											<Post
												photos={post.photos}
												postId={post.id}
												ownerId={post.owner_id}
											/>
										</Suspense>

									);
								})}
							</ul> :
							<div className={classes.contentNoPosts}>
								<p>This user hasn`t uploaded any posts yet</p>
							</div>
					}
				</div>
			</div>
		</MainLayout>
	);
}

export default Profile;