import searchCommentsForAdmin from "../../../../http/comments/searchCommentsForAdmin.http";
import searchPostsForAdmin from "../../../../http/posts/searchPostsForAdmin.http";
import searchUsersForAdmin from "../../../../http/user/searchUsersForAdmin.http";

interface IEventWithKey extends React.ChangeEvent<HTMLInputElement> {
	key: string;
}

const USER = "USER";
const POST = "POST";
const COMMENT = "COMMENT";

function searchAdminAction(
	event: IEventWithKey,
	table: "USER" | "POST" | "COMMENT",
	setText: (text: string | ((text: string) => string)) => void,
	setData: (value: React.SetStateAction<Array<any>>) => void
) {
	if (event.key !== "Enter") return;

	switch (table) {
		case POST:
			searchPostsForAdmin(+event.target?.value)
				.then((data) => {
					const { success, message, error, post } = data;

					if (!success) {
						setText(message || error);
						return;
					}

					if (post === undefined) {
						setData([]);
						return;
					}

					setData([post]);
				});
			break;
		case USER:
			searchUsersForAdmin(+event.target?.value)
				.then((data) => {
					const { success, message, error, person } = data;

					if (!success) {
						setText(message || error);
						return;
					}

					if (person === undefined) {
						setData([]);
						return;
					}

					setData([person]);
				});
			break;
		case COMMENT:
			searchCommentsForAdmin(+event.target?.value)
				.then((data) => {
					const { success, message, error, comment } = data;

					if (!success) {
						setText(message || error);
						return;
					}

					if (comment === undefined) {
						setData([]);
						return;
					}

					setData([comment]);
				});
			break;
	}
}

export default searchAdminAction;