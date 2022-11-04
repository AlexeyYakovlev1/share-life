import React, { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import HomePostLoading from "../../components/Loading/HomePost/HomePostLoading";
import AlertContext from "../../context/alert.context";
import { IPost } from "../../models/post.models";
import { IState } from "../../models/redux.models";
import getPostsAsyncAction from "../../redux/actions/async/posts/getPosts";
import classes from "./Home.module.sass";

function Home(): JSX.Element {
	const posts = useSelector((state: IState) => state.posts);
	const HomePost = React.lazy(() => import("../../components/HomePost/HomePost"));
	const dispatch: any = useDispatch();
	const { setText } = React.useContext(AlertContext);
	const [currentPage, setCurrentPage] = React.useState<number>(0);
	const [fetching, setFetching] = React.useState<boolean>(true);
	const [totalCount, setTotalCount] = React.useState<number>(0);

	React.useEffect(() => {
		if (!fetching) return;
		dispatch(getPostsAsyncAction(
			setText,
			{ limit: 2, page: currentPage },
			setCurrentPage,
			setFetching,
			setTotalCount,
			posts
		));
	}, [fetching]);

	React.useEffect(() => {
		document.addEventListener("scroll", scrollPosts);

		return function () {
			document.removeEventListener("scroll", scrollPosts);
		};
	}, [totalCount]);

	function scrollPosts(event: any) {
		const { scrollHeight, scrollTop } = event.target.documentElement;
		const height = window.innerHeight;

		// долистали до конца страницы
		if (scrollHeight - (scrollTop + height) < 100 && posts.length <= totalCount) {
			setFetching(true);
		}
	}

	return (
		<MainLayout>
			<article className={classes.wrapper}>
				<ul className={classes.list}>
					{(posts && posts.length) ? posts.map((post: IPost) => (
						<Suspense key={post.id} fallback={<HomePostLoading />}>
							<HomePost info={post} />
						</Suspense>
					)) : <span className={classes.noPosts}>Постов нет</span>}
				</ul>
			</article>
		</MainLayout>
	);
}

export default Home;