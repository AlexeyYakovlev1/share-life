import { trackPromise } from "react-promise-tracker";

const { REACT_APP_API_URL } = process.env;

function getPostsByUser(pageIdUser: number) {
	return trackPromise(fetch(`${REACT_APP_API_URL}/posts/all-by-user/${pageIdUser}`)
		.then((response) => response.json())
		.then((data) => data));
}

export default getPostsByUser;