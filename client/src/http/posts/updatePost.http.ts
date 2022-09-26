import Cookies from "js-cookie";
import { trackPromise } from "react-promise-tracker";

const { REACT_APP_API_URL } = process.env;

export interface IUpdateBody {
	photos: Array<string>;
	description: string;
	location: string;
}

function updatePost(postId: number | string, body: IUpdateBody) {
	return trackPromise(fetch(`${REACT_APP_API_URL}/posts/update/${postId}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(body)
	}))
		.then((response) => response.json())
		.then((data) => data);
}

export default updatePost;