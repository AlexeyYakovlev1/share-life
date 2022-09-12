import { trackPromise } from "react-promise-tracker";

const { REACT_APP_API_URL } = process.env;

function getOneUser(pageIdUser: number) {
	return trackPromise(fetch(`${REACT_APP_API_URL}/users/${pageIdUser}`)
		.then((response) => response.json())
		.then((data) => data));
}

export default getOneUser;