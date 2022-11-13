import React from "react";
import { useNavigate } from "react-router-dom";
import AlertContext from "../../context/alert.context";
import getOnePost from "../../http/posts/getOnePost.http";
import { IPost } from "../../models/post.models";

function usePost(
	conclusId: number | undefined | string | "NONE",
	postId: number | undefined | string,
	deps: Array<any>,
	callback = function () { }
) {
	const { setText } = React.useContext(AlertContext);
	const navigate = useNavigate();
	const [post, setPost] = React.useState<IPost>({
		id: -1,
		owner_id: -1,
		person_id_likes: [],
		location: "",
		photos: [{
			base64: "",
			filename: ""
		}],
		description: "",
		date: ""
	});

	React.useEffect(() => {
		if ((conclusId === "NONE" || conclusId !== -1) && postId) {
			getOnePost(+postId)
				.then((data) => {
					const { message, success, error, post: postFromServer } = data;

					if (!success) {
						setText(message || error);
						navigate("/");
						return;
					}

					if (callback) callback();
					setPost(postFromServer);
				});
		}
	}, [...deps]);

	return { post, setPost };
}

export default usePost;