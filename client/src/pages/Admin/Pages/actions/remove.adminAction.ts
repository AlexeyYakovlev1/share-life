import removeCommentAdmin from "../../../../http/admin/removeCommentAdmin.http";
import removePostAdmin from "../../../../http/admin/removePostAdmin.http";
import removeUser from "../../../../http/admin/removeUserAdmin.http";

const USER = "USER";
const POST = "POST";
const COMMENT = "COMMENT";

function removeAdminAction(
	id: number,
	table: "USER" | "COMMENT" | "POST",
	setText: (text: string | ((text: string) => string)) => void
) {
	if (id === -1) return;

	switch (table) {
		case USER:
			removeUser(id)
				.then((data) => {
					const { success, message, error } = data;
					setText(message || error);
					if (!success) return;
				});
			break;
		case POST:
			removePostAdmin(id)
				.then((data) => {
					const { success, message, error } = data;
					setText(message || error);
					if (!success) return;
				});
			break;
		case COMMENT:
			removeCommentAdmin(id)
				.then((data) => {
					const { success, message, error } = data;
					setText(message || error);
					if (!success) return;
				});
			break;
	}
}

export default removeAdminAction;