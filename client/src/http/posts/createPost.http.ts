import Cookies from "js-cookie";

const { REACT_APP_API_URL } = process.env;

function createPost(post: any) {
	return fetch(`${REACT_APP_API_URL}/posts/add`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${Cookies.get("token") || ""}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(post)
	})
		.then((response) => response.json())
		.then((data) => data);
}

export default createPost;