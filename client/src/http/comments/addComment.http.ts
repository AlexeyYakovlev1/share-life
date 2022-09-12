import Cookies from "js-cookie";
import { trackPromise } from "react-promise-tracker";

const { REACT_APP_API_URL } = process.env;

function addComment(postId: number, body: { text: string }) {
	return trackPromise(fetch(`${REACT_APP_API_URL}/comments/add/${postId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${Cookies.get("token")}`
		},
		body: JSON.stringify(body)
	})
		.then((response) => response.json())
		.then((data) => data));
}

export default addComment;