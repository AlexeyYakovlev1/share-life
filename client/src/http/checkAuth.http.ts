import Cookies from "js-cookie";

const { REACT_APP_API_URL } = process.env;

function checkAuth() {
	return fetch(`${REACT_APP_API_URL}/auth/check`, {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${Cookies.get("token")}`
		}
	})
		.then((response) => response.json())
		.then((data) => data);
}

export default checkAuth;