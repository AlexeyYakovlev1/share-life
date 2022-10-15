import Cookies from "js-cookie";
import { trackPromise } from "react-promise-tracker";

const { REACT_APP_API_URL } = process.env;

function removeUser(userId: number) {
	return trackPromise(fetch(`${REACT_APP_API_URL}/admin/remove/user/${userId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`
		}
	})
		.then((response) => response.json())
		.then((data) => data));
}

export default removeUser;