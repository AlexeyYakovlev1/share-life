import { trackPromise } from "react-promise-tracker";
import createPost from "../../../../http/posts/createPost.http";
import { IPost } from "../../../../models/post.models";
import { addPost } from "../../posts.actions";

function addPostAsyncAction(
	post: IPost,
	setErrors: React.Dispatch<React.SetStateAction<boolean>>,
	setText: React.Dispatch<React.SetStateAction<string>>
) {
	return (dispatch: React.Dispatch<any>) => {
		trackPromise(createPost(post)
			.then((data) => {
				const { success, message, errors, post: postFromServer } = data;

				if (errors && errors.length) {
					setErrors(true);
					return;
				}

				if (!success) {
					setText(message);
					return;
				}

				setText(message);
				dispatch(addPost(postFromServer));
			}));
	};
}

export default addPostAsyncAction;