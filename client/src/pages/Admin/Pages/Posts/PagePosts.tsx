import Input from "../../../../components/UI/Input/Input";
import classes from "../../Admin.module.sass";
import React from "react";
import Button from "../../../../components/UI/Button/Button";
import AlertContext from "../../../../context/alert.context";
import { IPost } from "../../../../models/post.models";
import PostItem from "./PostItem";
import getAllPosts from "../../../../http/posts/getAllPosts.http";

function PagePosts() {
	const tableTitles = ["id", "description", "author id", "edit", "delete"];
	const { setText } = React.useContext(AlertContext);
	const [posts, setPosts] = React.useState<Array<IPost>>([]);

	React.useEffect(() => {
		getAllPosts({ limit: 5, page: 0 })
			.then((data) => {
				const { success, error, message, posts: postsFromServer } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				setPosts(postsFromServer);
			});
	}, []);

	return (
		<React.Fragment>
			<header className={classes.contentHeader}>
				<Input
					type="text"
					placeholder="Write id post"
					className={classes.contentSearch}
				/>
				<Button>Find</Button>
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