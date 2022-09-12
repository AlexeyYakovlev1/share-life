import getAllComments from "../../../../http/comments/getAllComments.http";
import { setComments } from "../../comments.actions";

function getCommentsAsyncAction(
	setText: React.Dispatch<React.SetStateAction<string>>
) {
	return (dispatch: React.Dispatch<any>) => {
		getAllComments()
			.then((data) => {
				const { success, message, comments, error } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				dispatch(setComments(comments));
			});
	};
}

export default getCommentsAsyncAction;