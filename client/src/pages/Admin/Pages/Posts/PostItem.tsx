import classes from "../../Admin.module.sass";
import React from "react";
import Button from "../../../../components/UI/Button/Button";
import { IPost } from "../../../../models/post.models";
import { IPostActionInfo } from "./PagePosts";
import { IPageItem } from "../../Admin";
import { Link } from "react-router-dom";

interface IPostItem extends IPageItem {
	post: IPost;
	setActionInfo: React.Dispatch<React.SetStateAction<IPostActionInfo>>;
}

function PostItem({ post, setClose, setActionInfo }: IPostItem) {
	function removeClick() {
		setClose(false);
		setActionInfo((prevState) => ({
			...prevState, postId: post.id, remove: true, change: false
		}));
	}

	return (
		<React.Fragment>
			<td className={classes.contentItem}>
				<Link to={`/profile/${post.owner_id}?watch=true&post_id=${post.id}`}>
					{post.id}
				</Link>
			</td>
			<td className={classes.contentItem}>{post.description}</td>
			<td className={classes.contentItem}>{post.owner_id}</td>
			<td className={classes.contentItem}>
				<Button
					onClick={removeClick}
				>
					Delete
				</Button>
			</td>
		</React.Fragment>
	);
}

export default PostItem;