import Cookies from "js-cookie";
import { trackPromise } from "react-promise-tracker";

const { REACT_APP_API_URL } = process.env;

function removePostAdmin(postId: number) {
	return trackPromise(fetch(`${REACT_APP_API_URL}/admin/remove/post/${postId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`
		}
	})
		.then((response) => response.json())
		.then((data) => data));
}

export default removePostAdmin;