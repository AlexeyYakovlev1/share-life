import { IPagination } from "../../redux/actions/async/posts/getPosts";

const { REACT_APP_API_URL } = process.env;

function getAllPosts(pagination: IPagination) {
	const { limit, page } = pagination;

	return fetch(`${REACT_APP_API_URL}/posts/all/?_limit=${limit}&_page=${page}`)
		.then((response) => response.json())
		.then((data) => data);
}

export default getAllPosts;