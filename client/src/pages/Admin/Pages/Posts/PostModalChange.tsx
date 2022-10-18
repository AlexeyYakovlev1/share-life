import { IPost } from "../../../../models/post.models";
import { IModalChange } from "../Users/UserModalChange";
import { IPostActionInfo } from "./PagePosts";
import React from "react";
import AlertContext from "../../../../context/alert.context";
import getOnePost from "../../../../http/posts/getOnePost.http";
import Modal from "../../../../components/UI/Modal/Modal";
import classes from "../../Admin.module.sass";

interface IPostModalChange extends IModalChange {
	actionInfo: IPostActionInfo;
}

function PostModalChange({ setClose, actionInfo }: IPostModalChange) {
	const { setText } = React.useContext(AlertContext);
	const [currentPost, setCurrentPost] = React.useState<IPost>({
		id: -1,
		owner_id: -1,
		person_id_likes: [],
		location: "",
		photos: [{
			base64: "",
			filename: ""
		}],
		description: "",
		date: ""
	});

	React.useEffect(() => {
		if (actionInfo.postId === -1) return;

		getOnePost(actionInfo.postId)
			.then((data) => {
				const { success, message, error, post } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				setCurrentPost(post);
			});
	}, [actionInfo]);

	return (
		<Modal setClose={setClose}>
			<div className={classes.modalChange}>
				<header className={classes.modalChangeHeader}>
					<h3 className={classes.modalChangeTitle}>
						Edit post by id {actionInfo.postId}
					</h3>
				</header>
				<form className={classes.modalChangeContent}>
					<h3>Here must be content</h3>
				</form>
			</div>
		</Modal>
	);
}

export default PostModalChange;