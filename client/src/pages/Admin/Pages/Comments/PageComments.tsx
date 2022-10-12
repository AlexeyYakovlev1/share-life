import Input from "../../../../components/UI/Input/Input";
import classes from "../../Admin.module.sass";
import React from "react";
import AlertContext from "../../../../context/alert.context";
import { IComment } from "../../../../models/post.models";
import CommentItem from "./CommentItem";
import getAllComments from "../../../../http/comments/getAllComments.http";
import searchCommentsForAdmin from "../../../../http/comments/searchCommentsForAdmin.http";

function PageComments() {
	const tableTitles = ["id", "text", "author id", "post id", "delete"];
	const { setText } = React.useContext(AlertContext);
	const [comments, setComments] = React.useState<Array<IComment>>([]);

	function getComments() {
		getAllComments()
			.then((data) => {
				const { success, error, message, comments: commentsFromServer } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				setComments(commentsFromServer);
			});
	}

	React.useEffect(getComments, []);

	function searchCommentsHandler(event: any) {
		if (event.key !== "Enter") return;

		if (!event.target?.value) {
			getComments();
			return;
		}

		searchCommentsForAdmin(event.target?.value)
			.then((data) => {
				const { success, message, error, comment } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				if (comment === undefined) {
					setComments([]);
					return;
				}

				setComments([comment]);
			});
	}

	return (
		<React.Fragment>
			<header className={classes.contentHeader}>
				<Input
					type="text"
					placeholder="Write id comment"
					className={classes.contentSearch}
					onKeyDown={searchCommentsHandler}
				/>
			</header>
			<div className={classes.contentBody}>
				{comments.length ? <table className={classes.contentList}>
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
						{comments.map((comment: IComment) => (
							<tr key={comment.id}>
								<CommentItem comment={comment} />
							</tr>
						))}
					</thead>
				</table> : <h3 className={classes.contentEmptyTitle}>Nothing found</h3>}
			</div>
		</React.Fragment>
	);
}

export default PageComments;