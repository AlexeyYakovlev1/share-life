import React from "react";
import { NavigateFunction } from "react-router-dom";
import userAccess from "../http/access/userAccess.http";
import { IPost } from "../models/post.models";

function useAccessUser(
	post: IPost,
	userId: number,
	setText: (text: string | ((text: string) => string)) => void,
	navigate: NavigateFunction
) {
	React.useEffect(() => {
		if (userId === -1) return;

		userAccess(userId)
			.then((data) => {
				const { success, error, message } = data;

				if (!success) {
					setText(message || error);
					navigate("/");
					return;
				}
			});
	}, [post]);
}

export default useAccessUser;