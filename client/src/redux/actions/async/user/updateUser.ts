import React from "react";
import updateUser from "../../../../http/user/updateUser.http";
import { setUser } from "../../user.actions";

function updateUserAsyncAction(
	userId: number,
	body: any,
	setText: React.Dispatch<React.SetStateAction<string>>
) {
	return (dispatch: React.Dispatch<any>) => {

		updateUser(userId, body)
			.then((data) => {
				const { success, message, error, person } = data;

				setText(message || error);

				if (!success) {
					return;
				}

				dispatch(setUser(person));
			});
	};
}

export default updateUserAsyncAction;