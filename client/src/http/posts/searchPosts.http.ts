const { REACT_APP_API_URL } = process.env;

function searchPostsByKeyWords(searchVal: string) {
	return fetch(`${REACT_APP_API_URL}/search?q=${searchVal}`)
		.then((response) => response.json())
		.then((data) => data);
}

export default searchPostsByKeyWords;