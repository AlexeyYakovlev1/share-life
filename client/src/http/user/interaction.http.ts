import { trackPromise } from "react-promise-tracker";

const { REACT_APP_API_URL } = process.env;

function interactionFetch(pageUserId: number) {
	return trackPromise(fetch(`${REACT_APP_API_URL}/users/interaction/${pageUserId}`)
		.then((response) => response.json()));
}

export default interactionFetch;