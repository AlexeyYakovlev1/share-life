import classes from "../../Admin.module.sass";
import React from "react";
import Button from "../../../../components/UI/Button/Button";
import { IComment } from "../../../../models/post.models";

function CommentItem({ comment }: { comment: IComment }) {
	return (
		<React.Fragment>
			<td className={classes.contentItem}>{comment.id}</td>
			<td className={classes.contentItem}>{comment.text}</td>
			<td className={classes.contentItem}>{comment.owner_id}</td>
			<td className={classes.contentItem}>{comment.post_id}</td>
			<td className={classes.contentItem}>
				<Button>Delete</Button>
			</td>
		</React.Fragment>
	);
}

export default CommentItem;