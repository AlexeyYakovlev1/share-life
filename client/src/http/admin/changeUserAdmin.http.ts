import Cookies from "js-cookie";
import { trackPromise } from "react-promise-tracker";
import { IPerson } from "../../models/person.models";

const { REACT_APP_API_URL } = process.env;

function changeUserAdmin(userId: number, data: IPerson) {
	const payload = {
		full_name: data.full_name,
		user_name: data.user_name,
		roles: data.roles,
		email: data.email
	};

	return trackPromise(fetch(`${REACT_APP_API_URL}/admin/change/user/${userId}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${Cookies.get("token") || ""}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(payload)
	})
		.then((response) => response.json())
		.then((data) => data));
}

export default changeUserAdmin;