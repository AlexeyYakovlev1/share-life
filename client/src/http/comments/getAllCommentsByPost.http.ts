const { REACT_APP_API_URL } = process.env;

function getAllCommentsByPost(postId: number) {
	return fetch(`${REACT_APP_API_URL}/comments/all-by-post/${postId}`)
		.then((response) => response.json())
		.then((data) => data);
}

export default getAllCommentsByPost;