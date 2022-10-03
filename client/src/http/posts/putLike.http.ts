import Cookies from "js-cookie";
import { trackPromise } from "react-promise-tracker";

const { REACT_APP_API_URL } = process.env;

function putLike(postId: number) {
	return trackPromise(fetch(`${REACT_APP_API_URL}/posts/like/${postId}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`
		}
	})
		.then((response) => response.json())
		.then((data) => data));
}

export default putLike;