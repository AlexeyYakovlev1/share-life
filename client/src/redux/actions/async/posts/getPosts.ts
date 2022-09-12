import getAllPosts from "../../../../http/posts/getAllPosts.http";
import { setPosts } from "../../posts.actions";

function getPostsAsyncAction(
	setText: React.Dispatch<React.SetStateAction<string>>
) {
	return (dispatch: React.Dispatch<any>) => {
		getAllPosts()
			.then((data) => {
				const { success, message, posts } = data;

				if (!success) {
					setText(message);
					return;
				}

				dispatch(setPosts(posts));
			});
	};
}

export default getPostsAsyncAction;