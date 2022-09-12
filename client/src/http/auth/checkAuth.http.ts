import Cookies from "js-cookie";
import { trackPromise } from "react-promise-tracker";

const { REACT_APP_API_URL } = process.env;

function checkAuth() {
	return trackPromise(fetch(`${REACT_APP_API_URL}/auth/check`, {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${Cookies.get("token")}`
		}
	})
		.then((response) => response.json())
		.then((data) => data));
}

export default checkAuth;