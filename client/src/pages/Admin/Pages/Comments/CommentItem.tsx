import classes from "../../Admin.module.sass";
import React from "react";
import Button from "../../../../components/UI/Button/Button";
import { IComment } from "../../../../models/post.models";
import { ICommentActionInfo } from "./PageComments";
import { IPageItem } from "../../Admin";
import { Link } from "react-router-dom";

interface ICommentItem extends IPageItem {
	comment: IComment;
	setActionInfo: React.Dispatch<React.SetStateAction<ICommentActionInfo>>;
}

function CommentItem({ setActionInfo, comment, setClose }: ICommentItem) {
	function removeClick() {
		setClose(false);
		setActionInfo((prevState) => ({
			...prevState, commentId: comment.id, remove: true
		}));
	}

	return (
		<React.Fragment>
			<td className={classes.contentItem}>
				<Link to={`/profile/${comment.owner_id}?watch=true&post_id=${comment.post_id}`}>
					{comment.id}
				</Link>
			</td>
			<td className={classes.contentItem}>{comment.text}</td>
			<td className={classes.contentItem}>{comment.owner_id}</td>
			<td className={classes.contentItem}>{comment.post_id}</td>
			<td className={classes.contentItem}>
				<Button onClick={removeClick}>Удалить</Button>
			</td>
		</React.Fragment>
	);
}

export default CommentItem;