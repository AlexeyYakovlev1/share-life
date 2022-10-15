import Cookies from "js-cookie";
import { trackPromise } from "react-promise-tracker";

const { REACT_APP_API_URL } = process.env;

function removeCommentAdmin(commentId: number) {
	return trackPromise(fetch(`${REACT_APP_API_URL}/admin/remove/comment/${commentId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`
		}
	})
		.then((response) => response.json())
		.then((data) => data));
}

export default removeCommentAdmin;