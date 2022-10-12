import Input from "../../../../components/UI/Input/Input";
import classes from "../../Admin.module.sass";
import React from "react";
import AlertContext from "../../../../context/alert.context";
import { IPost } from "../../../../models/post.models";
import PostItem from "./PostItem";
import getAllPosts from "../../../../http/posts/getAllPosts.http";
import searchPostsForAdmin from "../../../../http/posts/searchPostsForAdmin.http";

function PagePosts() {
	const tableTitles = ["id", "description", "author id", "edit", "delete"];
	const { setText } = React.useContext(AlertContext);
	const [posts, setPosts] = React.useState<Array<IPost>>([]);

	function getPosts() {
		getAllPosts({ limit: 5, page: 0 })
			.then((data) => {
				const { success, error, message, posts: postsFromServer } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				setPosts(postsFromServer);
			});
	}

	React.useEffect(getPosts, []);

	function searchPostsHandler(event: any) {
		if (event.key !== "Enter") return;

		if (!event.target?.value) {
			getPosts();
			return;
		}

		searchPostsForAdmin(event.target?.value)
			.then((data) => {
				const { success, message, error, post } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				if (post === undefined) {
					setPosts([]);
					return;
				}

				setPosts([post]);
			});
	}

	return (
		<React.Fragment>
			<header className={classes.contentHeader}>
				<Input
					type="text"
					placeholder="Write id post"
					className={classes.contentSearch}
					onKeyDown={searchPostsHandler}
				/>
			</header>
			<div className={classes.contentBody}>
				{posts.length ? <table className={classes.contentList}>
					<thead>
						<tr>
							{tableTitles.map((title: string, index: number) => (
								<th
									key={`${title[title.length - 1]}_${index + 1}`}
									className={classes.contentListTitle}
								>
									{title.toUpperCase()}
								</th>
							))}
						</tr>
						{posts.map((post: IPost) => (
							<tr key={post.id}>
								<PostItem post={post} />
							</tr>
						))}
					</thead>
				</table> : <h3 className={classes.contentEmptyTitle}>Nothing found</h3>}
			</div>
		</React.Fragment>
	);
}

export default PagePosts;