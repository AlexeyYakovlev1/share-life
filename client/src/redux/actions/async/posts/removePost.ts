import { trackPromise } from "react-promise-tracker";
import removePost from "../../../../http/posts/removePost.http";
import { removePost as removePostInRedux } from "../../../../redux/actions/posts.actions";

function removePostAsyncAction(
	postId: number,
	setText: React.Dispatch<React.SetStateAction<string>>
) {
	return (dispatch: React.Dispatch<any>) => {
		trackPromise(removePost(postId)
			.then((data) => {
				const { message, error } = data;
				setText(message || error);
				dispatch(removePostInRedux(postId));
			}));
	};
}

export default removePostAsyncAction;