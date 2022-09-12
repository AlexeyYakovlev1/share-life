import { trackPromise } from "react-promise-tracker";

const { REACT_APP_API_URL } = process.env;

function login(user: any) {
	return trackPromise(fetch(`${REACT_APP_API_URL}/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(user)
	})
		.then((response) => response.json())
		.then((data) => data));
}

export default login;