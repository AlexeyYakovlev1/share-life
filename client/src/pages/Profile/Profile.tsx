import { Link, useParams, useSearchParams } from "react-router-dom";
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
import AlertContext from "../../context/alert.context";
import { IPerson } from "../../models/person.models";
import getOneUser from "../../http/user/getOneUser.http";
import useAvatar from "../../hooks/useAvatar";
import { IState } from "../../models/redux.models";
import { useSelector } from "react-redux";

function Profile(): JSX.Element {
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
		roles: [""]
	});
	const [currentUser, setCurrentUser] = React.useState<boolean>(false);

	const { id: currentIdUser } = useSelector((state: IState) => state.person.info);
	const posts = useSelector((state: IState) => state.posts);
	const userPosts = posts.filter((post: IPost) => +post.owner_id === +pageUser.id);

	const pageAvatarUser = useAvatar(pageUser.avatar.base64);
	const [searchParams, setSearchParams] = useSearchParams();
	const queryPostOpen = searchParams.get("watch") === "true";
	const queryPostId = searchParams.get("post_id");
	const { setCount, count } = useSlider({ list: posts });
	const { id: pageIdUser } = useParams();
	const { setText } = React.useContext(AlertContext);

	React.useEffect(() => {
		if (pageIdUser) {
			getOneUser(+pageIdUser)
				.then((data: any) => {
					const { success, person, message } = data;

					if (!success) {
						setText(message);
						return;
					}

					setPageUser(person);
					setCurrentUser(+pageIdUser === +currentIdUser);
				});
		}
	}, [pageIdUser, currentIdUser]);

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

	return (
		<MainLayout>
			<div className={classes.wrapper}>
				{queryPostOpen &&
					<React.Fragment>
						{posts.length > 1 && <div className={classes.switchPost}>
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
						<OpenPost ownerId={pageUser.id} />
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
								<Button className={classes.infoTopButton}>Follow</Button>
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
					{
						userPosts.length ?
							<ul className={classes.contentList}>
								{posts.map((post: IPost) => {
									return (
										<Post
											key={post.id}
											photos={post.photos}
											postId={post.id}
											ownerId={post.owner_id}
										/>
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