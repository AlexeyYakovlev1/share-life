import Input from "../../../../components/UI/Input/Input";
import classes from "../../Admin.module.sass";
import React from "react";
import AlertContext from "../../../../context/alert.context";
import { IPost } from "../../../../models/post.models";
import PostItem from "./PostItem";
import getAllPosts from "../../../../http/posts/getAllPosts.http";
import searchPostsForAdmin from "../../../../http/posts/searchPostsForAdmin.http";
import Modal from "../../../../components/UI/Modal/Modal";
import Button from "../../../../components/UI/Button/Button";
import removePostAdmin from "../../../../http/admin/removePostAdmin.http";
import { IActionInfo } from "../../Admin";

export interface IPostActionInfo extends IActionInfo {
	postId: number;
}

function PagePosts() {
	const tableTitles = ["id", "description", "author id", "edit", "delete"];
	const { setText } = React.useContext(AlertContext);

	const [posts, setPosts] = React.useState<Array<IPost>>([]);
	const [actionInfo, setActionInfo] = React.useState<IPostActionInfo>({
		postId: -1, remove: false, change: false
	});
	const [close, setClose] = React.useState<boolean>(true);

	React.useEffect(getPosts, []);

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

	function removePostClick() {
		if (actionInfo.postId === -1) return;

		removePostAdmin(actionInfo.postId)
			.then((data) => {
				const { success, message, error } = data;
				setText(message || error);
				if (!success) return;
				setClose(true);
			});
	}

	function changePostClick() {
		console.log("change post");
	}

	return (
		<React.Fragment>
			{!close && <Modal setClose={setClose}>
				<div className={classes.modal}>
					<header className={classes.modalHeader}>
						<h3 className={classes.modalTitle}>You sure?</h3>
						<p className={classes.modalDescription}>
							Post by id {actionInfo.postId} will be removed full!
						</p>
					</header>
					<div className={classes.modalActions}>
						<Button
							onClick={actionInfo.remove ? removePostClick : changePostClick}
						>
							Yes
						</Button>
						<Button
							className={classes.modalButtonActive}
							onClick={() => setClose(true)}
						>
							No
						</Button>
					</div>
				</div>
			</Modal>}
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
								<PostItem
									setActionInfo={setActionInfo}
									setClose={setClose}
									post={post}
								/>
							</tr>
						))}
					</thead>
				</table> : <h3 className={classes.contentEmptyTitle}>Nothing found</h3>}
			</div>
		</React.Fragment>
	);
}

export default PagePosts;