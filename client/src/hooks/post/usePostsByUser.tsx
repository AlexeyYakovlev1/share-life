import React from "react";
import AlertContext from "../../context/alert.context";
import getPostsByUser from "../../http/posts/getPostsByUser.http";
import { IPost } from "../../models/post.models";

function usePostsByUser(
	conclusId: number | undefined | string | "NONE",
	userId: number | undefined | string,
	deps: Array<any>,
	callback = function () { }
) {
	const { setText } = React.useContext(AlertContext);
	const [posts, setPosts] = React.useState<Array<IPost>>([]);

	React.useEffect(() => {
		if ((conclusId === "NONE" || conclusId !== -1) && userId) {
			getPostsByUser(+userId)
				.then((data) => {
					const { success, posts, message, error } = data;

					if (!success) {
						setText(message || error);
						return;
					}

					if (callback) callback();
					setPosts(posts);
				});
		}
	}, [...deps]);

	return { posts, setPosts };
}

export default usePostsByUser;