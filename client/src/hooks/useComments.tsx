import React from "react";
import AlertContext from "../context/alert.context";
import getAllCommentsByPost from "../http/comments/getAllCommentsByPost.http";
import { IComment } from "../models/post.models";

function useComments(
	conclusId: number | undefined | string | "NONE",
	postId: number | undefined | string,
	deps: Array<any>,
	callback = function () { }
) {
	const { setText } = React.useContext(AlertContext);
	const [comments, setComments] = React.useState<Array<IComment>>([]);
	const [viewComments, setViewComments] = React.useState<boolean>(comments.length >= 3);

	React.useEffect(() => {
		if ((conclusId === "NONE" || conclusId !== -1) && postId) {
			getAllCommentsByPost(+postId)
				.then((data) => {
					const { success, message, error, comments } = data;

					if (!success) {
						setText(message || error);
						return;
					}

					if (callback) callback();
					setComments(comments);
					setViewComments(comments.length >= 3);
				});
		}
	}, [...deps]);

	return { comments, setComments, viewComments, setViewComments };
}

export default useComments;