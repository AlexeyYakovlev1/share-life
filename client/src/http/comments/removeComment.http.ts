import Cookies from "js-cookie";
import { trackPromise } from "react-promise-tracker";
import { IComment } from "../../models/post.models";

const { REACT_APP_API_URL } = process.env;

function removeComment(comment: IComment) {
	return trackPromise(fetch(`${REACT_APP_API_URL}/comments/remove/${comment.id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`
		}
	})
		.then((response) => response.json()));
}

export default removeComment;