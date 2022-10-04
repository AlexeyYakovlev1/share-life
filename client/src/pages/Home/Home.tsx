import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import HomePostLoading from "../../components/Loading/HomePost/HomePostLoading";
import { IPost } from "../../models/post.models";
import { IState } from "../../models/redux.models";
import classes from "./Home.module.sass";

function Home(): JSX.Element {
	const posts = useSelector((state: IState) => state.posts);
	const HomePost = React.lazy(() => import("../../components/HomePost/HomePost"));

	return (
		<MainLayout>
			<div className={classes.wrapper}>
				<ul className={classes.list}>
					{(posts && posts.length) ? posts.map((post: IPost) => (
						<Suspense key={post.id} fallback={<HomePostLoading />}>
							<HomePost info={post} />
						</Suspense>
					)) : <span className={classes.noPosts}>No posts</span>}
				</ul>
			</div>
		</MainLayout>
	);
}

export default Home;