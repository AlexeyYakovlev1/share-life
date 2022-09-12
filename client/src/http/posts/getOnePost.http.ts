import { trackPromise } from "react-promise-tracker";

const { REACT_APP_API_URL } = process.env;

function getOnePost(id: number) {
	return trackPromise(fetch(`${REACT_APP_API_URL}/posts/${id}`)
		.then((response) => response.json())
		.then((data) => data));
}

export default getOnePost;