import getAllPosts from "../../../../http/posts/getAllPosts.http";
import { IPost } from "../../../../models/post.models";
import { setPosts } from "../../posts.actions";

export interface IPagination {
	limit: number;
	page: number;
}

function getPostsAsyncAction(
	setText: React.Dispatch<React.SetStateAction<string>>,
	pagination: IPagination,
	setPage: React.Dispatch<React.SetStateAction<number>>,
	setFetching: React.Dispatch<React.SetStateAction<boolean>>,
	posts: Array<IPost>
) {
	return (dispatch: React.Dispatch<any>) => {
		getAllPosts(pagination)
			.then((data) => {
				const { success, message } = data;

				if (!success) {
					setText(message);
					return;
				}

				const postsFromServer = data.posts.filter((p: IPost) => {
					return !posts.map(post => post.id).includes(+p.id);
				});

				dispatch(setPosts([...posts, ...postsFromServer]));
				setPage((prevState) => prevState + 2);
			})
			.finally(() => setFetching(false));
	};
}

export default getPostsAsyncAction;