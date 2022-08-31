import React from "react";
import HomePost from "../../components/HomePost/HomePost";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import AlertContext from "../../context/alert.context";
import LoaderContext from "../../context/loader.context";
import getAllPosts from "../../http/posts/getAllPosts.http";
import { IPost } from "../../models/post.models";
import classes from "./Home.module.sass";

function Home(): JSX.Element {
	const [posts, setPosts] = React.useState<Array<IPost>>([]);

	const { setLoad } = React.useContext(LoaderContext);
	const { setText } = React.useContext(AlertContext);

	React.useEffect(() => {
		setLoad(true);
		getAllPosts()
			.then((data) => {
				const { success, message, posts } = data;

				if (!success) {
					setLoad(false);
					setText(message);
					return;
				}

				setPosts(posts);
			});
		setLoad(false);
	}, []);

	return (
		<MainLayout>
			<div className={classes.wrapper}>
				<ul className={classes.list}>
					{(posts && posts.length) ? posts.map((post: IPost) => (
						<HomePost key={post.id} info={post} />
					)) : <span>No posts...</span>}
				</ul>
			</div>
		</MainLayout>
	);
}

export default Home;