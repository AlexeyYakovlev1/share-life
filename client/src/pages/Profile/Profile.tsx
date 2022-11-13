import { Link, useParams } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import { IPost } from "../../models/post.models";
import classes from "./Profile.module.sass";
import React from "react";
import cn from "classnames";
import AlertContext from "../../context/alert.context";
import useAvatar from "../../hooks/user/useAvatar";
import { IState } from "../../models/redux.models";
import { useSelector } from "react-redux";
import { useFollow } from "../../hooks/user/useFollow";
import useTheme from "../../hooks/useTheme";
import { Suspense } from "react";
import ProfilePostLoading from "../../components/Loading/ProfilePost/ProfilePostLoading";
import useUser from "../../hooks/user/useUser";
import usePostsByUser from "../../hooks/post/usePostsByUser";

function Profile(): JSX.Element {
	const Post = React.lazy(() => import("./Post"));
	const { light, dark } = useTheme();

	const { id: pageIdUser } = useParams();
	const { setText } = React.useContext(AlertContext);

	const { id: currentIdUser } = useSelector((state: IState) => state.person.info);
	const { user: pageUser } = useUser(pageIdUser, pageIdUser, [pageIdUser, currentIdUser], () => {
		pageIdUser && setCurrentUser(+pageIdUser === +currentIdUser);
	});
	const { posts: userPosts } = usePostsByUser(pageIdUser, pageIdUser, [pageIdUser, currentIdUser]);

	const [followUser, setFollowUser] = React.useState<boolean>(pageUser.followers.includes(currentIdUser));
	const [currentUser, setCurrentUser] = React.useState<boolean>(false);
	const pageAvatarUser = useAvatar(pageUser.avatar.base64);
	const { followClick } = useFollow(+pageUser.id, setText, setFollowUser);

	return (
		<MainLayout>
			<article className={cn(classes.wrapper, {
				[classes.light]: light,
				[classes.dark]: dark
			})}>
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
									{followUser ? "Отписаться" : "Подписаться"}
								</Button>
								:
								<Button className={classes.infoTopButton}>
									<Link to="/settings">Настройки</Link>
								</Button>
							}
						</div>
						<div className={classes.infoNums}>
							<ul className={classes.infoNumsList}>
								<li className={classes.infoNumsItem}>
									<span>
										<Link to="/"><strong>{userPosts.length}</strong> постов</Link>
									</span>
								</li>
								<li className={classes.infoNumsItem}>
									<span>
										<Link to={`/interaction/${pageUser.id}?followers=y`}>
											<strong>{pageUser.followers.length}</strong> подписчиков
										</Link>
									</span>
								</li>
								<li className={classes.infoNumsItem}>
									<span>
										<Link to={`/interaction/${pageUser.id}?following=y`}>
											<strong>{pageUser.following.length}</strong> подписок
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
									const payload = {
										...post, photo: post.photos[0].base64
									};

									return (
										<Suspense
											key={post.id}
											fallback={<ProfilePostLoading />}
										>
											<Post {...payload} />
										</Suspense>

									);
								})}
							</ul> :
							<div className={classes.contentNoPosts}>
								<p>Здесь ничего нет</p>
							</div>
					}
				</div>
			</article>
		</MainLayout>
	);
}

export default Profile;