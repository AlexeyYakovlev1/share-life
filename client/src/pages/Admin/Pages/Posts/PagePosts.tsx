import Input from "../../../../components/UI/Input/Input";
import classes from "../../Admin.module.sass";
import React from "react";
import AlertContext from "../../../../context/alert.context";
import { IPost } from "../../../../models/post.models";
import PostItem from "./PostItem";
import Modal from "../../../../components/UI/Modal/Modal";
import Button from "../../../../components/UI/Button/Button";
import { IActionInfo } from "../../Admin";
import removeAdminAction from "../actions/remove.adminAction";
import searchAdminAction from "../actions/search.adminAction";
import getAdminAction from "../actions/get.adminAction";

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

	function removePostClick() {
		removeAdminAction(actionInfo.postId, "POST", setText);
		setClose(true);
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