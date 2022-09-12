import { trackPromise } from "react-promise-tracker";

const { REACT_APP_API_URL } = process.env;

function getAllComments() {
	return trackPromise(fetch(`${REACT_APP_API_URL}/comments/all`)
		.then((response) => response.json())
		.then((data) => data));
}

export default getAllComments;