import React from "react";
import createPost from "../../../../http/posts/createPost.http";
import { IPost, IPostForAdd } from "../../../../models/post.models";
import { addPost } from "../../posts.actions";

function addPostAsyncAction(
	post: IPost | IPostForAdd,
	setErrors: React.Dispatch<React.SetStateAction<boolean>>,
	setText: React.Dispatch<React.SetStateAction<string>>
) {
	return (dispatch: React.Dispatch<any>) => {
		createPost(post)
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
			});
	};
}

export default addPostAsyncAction;