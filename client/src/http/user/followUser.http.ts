import Cookies from "js-cookie";
import { trackPromise } from "react-promise-tracker";

const { REACT_APP_API_URL } = process.env;

function followUserFetch(pageIdUser: string) {
	return trackPromise(fetch(`${REACT_APP_API_URL}/users/follow/${pageIdUser}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`
		}
	})
		.then((response) => response.json())
		.then((data) => data));
}

export default followUserFetch;