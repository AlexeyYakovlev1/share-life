import Cookies from "js-cookie";

const { REACT_APP_API_URL } = process.env;

function addComment(postId: number, body: { text: string }) {
	return fetch(`${REACT_APP_API_URL}/comments/add/${postId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${Cookies.get("token")}`
		},
		body: JSON.stringify(body)
	})
		.then((response) => response.json())
		.then((data) => data);
}

export default addComment;