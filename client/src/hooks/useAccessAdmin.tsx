import React from "react";
import { useNavigate } from "react-router-dom";
import AlertContext from "../context/alert.context";
import adminAccess from "../http/access/adminAccess.http";

function useAccessAdmin() {
	const { setText } = React.useContext(AlertContext);
	const navigate = useNavigate();

	React.useEffect(() => {
		adminAccess()
			.then((data) => {
				const { success, message, error } = data;

				if (!success) {
					setText(message || error);
					navigate("/");
					return;
				}
			});
	}, []);
}

export default useAccessAdmin;