import React from "react";
import { useNavigate } from "react-router-dom";
import AlertContext from "../../context/alert.context";
import userAccess from "../../http/access/userAccess.http";

function useAccessUser(
	deps: Array<any>,
	userId: number
) {
	const { setText } = React.useContext(AlertContext);
	const navigate = useNavigate();

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
	}, [...deps]);
}

export default useAccessUser;