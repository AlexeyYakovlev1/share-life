import { useSelector } from "react-redux";
import HomePost from "../../components/HomePost/HomePost";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import { IPost } from "../../models/post.models";
import { IState } from "../../models/redux.models";
import classes from "./Home.module.sass";

function Home(): JSX.Element {
	const posts = useSelector((state: IState) => state.posts);

	return (
		<MainLayout>
			<div className={classes.wrapper}>
				<ul className={classes.list}>
					{(posts && posts.length) ? posts.map((post: IPost) => (
						<HomePost key={post.id} info={post} />
					)) : <span>No posts</span>}
				</ul>
			</div>
		</MainLayout>
	);
}

export default Home;