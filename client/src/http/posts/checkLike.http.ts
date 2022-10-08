import Cookies from "js-cookie";

const { REACT_APP_API_URL } = process.env;

function checkLike(postId: number) {
	return fetch(`${REACT_APP_API_URL}/posts/check-like/${postId}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`
		}
	})
		.then((response) => response.json())
		.then((data) => data);
}

export default checkLike;