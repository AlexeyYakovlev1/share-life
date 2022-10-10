import classes from "../../Admin.module.sass";
import React from "react";
import Button from "../../../../components/UI/Button/Button";
import { IPost } from "../../../../models/post.models";

function PostItem({ post }: { post: IPost }) {
	return (
		<React.Fragment>
			<td className={classes.contentItem}>{post.id}</td>
			<td className={classes.contentItem}>{post.description}</td>
			<td className={classes.contentItem}>{post.owner_id}</td>
			<td className={classes.contentItem}>
				<Button>Edit</Button>
			</td>
			<td className={classes.contentItem}>
				<Button>Delete</Button>
			</td>
		</React.Fragment>
	);
}

export default PostItem;