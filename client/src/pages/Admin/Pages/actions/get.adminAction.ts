import getAllComments from "../../../../http/comments/getAllComments.http";
import getAllPosts from "../../../../http/posts/getAllPosts.http";
import getAllUsers from "../../../../http/user/getAllUsers.http";

const USER = "USER";
const POST = "POST";
const COMMENT = "COMMENT";

function getAdminAction(
	table: "USER" | "POST" | "COMMENT",
	setData: React.Dispatch<React.SetStateAction<Array<any>>>,
	setText: React.Dispatch<React.SetStateAction<string>>
) {
	switch (table) {
		case USER:
			getAllUsers()
				.then((data) => {
					const { success, message, error, persons } = data;

					if (!success) {
						setText(message || error);
						return;
					}

					setData(persons);
				});
			break;
		case POST:
			getAllPosts({ limit: 5, page: 0 })
				.then((data) => {
					const { success, error, message, posts: postsFromServer } = data;

					if (!success) {
						setText(message || error);
						return;
					}

					setData(postsFromServer);
				});
			break;
		case COMMENT:
			getAllComments()
				.then((data) => {
					const { success, error, message, comments: commentsFromServer } = data;

					if (!success) {
						setText(message || error);
						return;
					}

					setData(commentsFromServer);
				});
			break;
	}
}

export default getAdminAction;