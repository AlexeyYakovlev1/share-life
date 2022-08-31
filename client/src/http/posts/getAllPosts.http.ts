const { REACT_APP_API_URL } = process.env;

function getAllPosts() {
	return fetch(`${REACT_APP_API_URL}/posts/all`)
		.then((response) => response.json())
		.then((data) => data);
}

export default getAllPosts;