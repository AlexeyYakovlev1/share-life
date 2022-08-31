import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import OpenPost from "../../components/OpenPost/OpenPost";
import Post from "./Post";
import Button from "../../components/UI/Button/Button";
import { IPost } from "../../models/post.models";
import classes from "./Profile.module.sass";
import React from "react";
import { ReactComponent as ArrowLeftIcon } from "../../assets/images/arrow-left.svg";
import cn from "classnames";
import { useSlider } from "../../hooks/useSlider";
import LoaderContext from "../../context/loader.context";
import AlertContext from "../../context/alert.context";
import { IPerson } from "../../models/person.models";
import getOneUser from "../../http/user/getOneUser.http";
import getPostsByUser from "../../http/posts/getPostsByUser.http";
import useAvatar from "../../hooks/useAvatar";
import { IState } from "../../models/redux.models";
import { useSelector } from "react-redux";

function Profile(): JSX.Element {
	const [posts, setPosts] = React.useState<Array<IPost>>([{
		id: -1,
		owner_id: -1,
		photos: [""],
		description: ""
	}]);
	const [pageUser, setPageUser] = React.useState<IPerson>({
		id: -1,
		full_name: "",
		user_name: "",
		email: "",
		avatar: "",
		password: "",
		description: "",
		roles: ["USER"]
	});
	const [currentUser, setCurrentUser] = React.useState<boolean>(false);

	const pageAvatarUser = useAvatar(pageUser.avatar);

	const search = useLocation().search;
	const query = new URLSearchParams(search);
	const queryPostOpen = query.get("watch");
	const [searchParams, setSearchParams] = useSearchParams();
	const queryPostId = searchParams.get("post_id");
	const { setCount, count } = useSlider({ list: posts });
	const { id: pageIdUser } = useParams();

	const { setLoad } = React.useContext(LoaderContext);
	const { setText } = React.useContext(AlertContext);

	const { id: currentIdUser } = useSelector((state: IState) => state.person.info);

	React.useEffect(() => {
		setLoad(true);
		if (pageIdUser && currentIdUser > 0) {
			getOneUser(+pageIdUser)
				.then((data: any) => {
					const { success, person, message } = data;

					if (!success) {
						setLoad(false);
						setText(message);
						return;
					}

					setPageUser(person);
					setCurrentUser(+pageIdUser === +currentIdUser);
				});

			getPostsByUser(+pageIdUser)
				.then((data) => {
					const { success, posts, message } = data;

					if (!success) {
						setLoad(false);
						setText(message);
						return;
					}

					setPosts(posts);
				});
		}
		setLoad(false);
	}, [pageIdUser, currentIdUser]);

	React.useEffect(() => {
		if (posts[count] && queryPostOpen === "true") {
			setSearchParams({ watch: `${!!queryPostOpen}`, post_id: `${posts[count].id}` });
		}
	}, [count]);

	React.useEffect(() => {
		if (queryPostId) {
			setCount(posts.findIndex(item => item.id === +queryPostId));
		}
	}, [queryPostId]);

	return (
		<MainLayout>
			<div className={classes.wrapper}>
				{(queryPostOpen && queryPostId) &&
					<React.Fragment>
						<div className={classes.switchPost}>
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
						</div>
						<OpenPost postId={queryPostId} />
					</React.Fragment>
				}
				<div className={classes.top}>
					<img
						className={classes.avatar}
						src={pageAvatarUser}
						alt="avatar"
					/>
					<div className={classes.info}>
						<div className={classes.infoTop}>
							<span className={classes.name}>{pageUser.user_name}</span>
							{!currentUser
								?
								<Button className={classes.infoTopButton}>Following</Button>
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
										<Link to="/"><strong>12</strong> post</Link>
									</span>
								</li>
								<li className={classes.infoNumsItem}>
									<span>
										<Link to="/"><strong>577</strong> followers</Link>
									</span>
								</li>
								<li className={classes.infoNumsItem}>
									<span>
										<Link to="/"><strong>65</strong> following</Link>
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
					<ul className={classes.contentList}>
						{posts.length ? posts.map((post: IPost) => {
							return (
								<Post
									key={post.id}
									photos={post.photos}
									postId={post.id}
								/>
							);
						}) : <span>No posts...</span>}
					</ul>
				</div>
			</div>
		</MainLayout>
	);
}

export default Profile;