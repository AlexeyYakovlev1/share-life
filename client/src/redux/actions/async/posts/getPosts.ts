import React from "react";
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
	setTotalCount: React.Dispatch<React.SetStateAction<number>>,
	posts: Array<IPost>
) {
	return (dispatch: React.Dispatch<any>) => {
		getAllPosts(pagination, setFetching, setTotalCount)
			.then((data) => {
				const { success, message, posts: postsFromServer } = data;

				if (!success) {
					setText(message);
					return;
				}

				const newPosts = postsFromServer.filter((p: IPost) => {
					return !posts.map(post => post.id).includes(+p.id);
				});

				dispatch(setPosts([...posts, ...newPosts]));
				setPage((prevState) => prevState + 1);
			});
	};
}

export default getPostsAsyncAction;