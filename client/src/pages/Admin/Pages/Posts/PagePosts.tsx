import Input from "../../../../components/UI/Input/Input";
import classes from "../../Admin.module.sass";
import React from "react";
import AlertContext from "../../../../context/alert.context";
import { IPost } from "../../../../models/post.models";
import PostItem from "./PostItem";
import { IActionInfo } from "../../Admin";
import searchAdminAction from "../actions/search.adminAction";
import getAdminAction from "../actions/get.adminAction";
import PostModalRemove from "./PostModalRemove";

export interface IPostActionInfo extends IActionInfo {
	postId: number;
}

function PagePosts() {
	const tableTitles = ["id", "description", "author id", "delete"];
	const { setText } = React.useContext(AlertContext);

	const [posts, setPosts] = React.useState<Array<IPost>>([]);
	const [actionInfo, setActionInfo] = React.useState<IPostActionInfo>({
		postId: -1, remove: false, change: false
	});
	const [close, setClose] = React.useState<boolean>(true);

	React.useEffect(getPosts, []);

	function getPosts() {
		getAdminAction("POST", setPosts, setText);
	}

	function searchPostsHandler(event: any) {
		if (event.key !== "Enter") return;

		if (!event.target?.value) {
			getPosts();
			return;
		}

		searchAdminAction(event, "POST", setText, setPosts);
	}

	return (
		<React.Fragment>
			{(!close && actionInfo.remove) &&
				<PostModalRemove setClose={setClose} actionInfo={actionInfo} />
			}
			<header className={classes.contentHeader}>
				<Input
					type="text"
					placeholder="Напишите id поста"
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
								<PostItem
									setActionInfo={setActionInfo}
									setClose={setClose}
									post={post}
								/>
							</tr>
						))}
					</thead>
				</table> : <h3 className={classes.contentEmptyTitle}>Ничего не найдено</h3>}
			</div>
		</React.Fragment>
	);
}

export default PagePosts;