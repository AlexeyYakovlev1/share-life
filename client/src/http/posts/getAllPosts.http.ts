import { IPagination } from "../../redux/actions/async/posts/getPosts";

const { REACT_APP_API_URL } = process.env;

type TSetFetching = React.Dispatch<React.SetStateAction<boolean>> | null;
type TSetTotalCount = React.Dispatch<React.SetStateAction<number>> | null;

function getAllPosts(
	pagination: IPagination,
	setFetching: TSetFetching = null,
	setTotalCount: TSetTotalCount = null
) {
	const { limit, page } = pagination;

	return fetch(`${REACT_APP_API_URL}/posts/all/?_limit=${limit}&_page=${page}`)
		.then((response) => response.json())
		.then((data) => {
			const { totalCount } = data;
			if (setTotalCount) setTotalCount(totalCount);
			return data;
		})
		.finally(() => {
			if (!setFetching) return;
			setFetching(false);
		});
}

export default getAllPosts;