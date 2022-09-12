import Cookies from "js-cookie";
import { trackPromise } from "react-promise-tracker";

const { REACT_APP_API_URL } = process.env;

function updateUser(userId: number, body: any) {
	for (const key in body) {
		const value = body[key];
		(typeof value === "string" && !value.length) ? body[key] = null : false;
	}

	return trackPromise(fetch(`${REACT_APP_API_URL}/users/update/${userId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${Cookies.get("token")}`
		},
		body: JSON.stringify(body)
	})
		.then((response) => response.json())
		.then((data) => data));
}

export default updateUser;