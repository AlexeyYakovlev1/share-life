import Cookies from "js-cookie";
import { trackPromise } from "react-promise-tracker";

const { REACT_APP_API_URL } = process.env;

function createPost(post: any) {
	return trackPromise(fetch(`${REACT_APP_API_URL}/posts/add`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${Cookies.get("token") || ""}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(post)
	})
		.then((response) => response.json())
		.then((data) => data));
}

export default createPost;