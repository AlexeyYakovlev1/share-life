import Cookies from "js-cookie";

const { REACT_APP_API_URL } = process.env;

function updateUser(userId: number, body: any) {
	return fetch(`${REACT_APP_API_URL}/users/update/${userId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${Cookies.get("token")}`
		},
		body: JSON.stringify(body)
	})
		.then((response) => response.json())
		.then((data) => data);
}

export default updateUser;