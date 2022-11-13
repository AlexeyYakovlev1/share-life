import React from "react";
import { useNavigate } from "react-router-dom";
import AlertContext from "../../context/alert.context";
import getOneUser from "../../http/user/getOneUser.http";
import { IPerson } from "../../models/person.models";
import useAvatar from "./useAvatar";

function useUser(
	conclusId: number | undefined | string | "NONE",
	userId: number | undefined | string,
	deps: Array<any>,
	callback = function () { }
) {
	const { setText } = React.useContext(AlertContext);
	const navigate = useNavigate();
	const [user, setUser] = React.useState<IPerson>({
		id: -1,
		full_name: "",
		user_name: "",
		email: "",
		avatar: {
			base64: "",
			filename: ""
		},
		password: "",
		description: "",
		roles: [""],
		followers: [],
		following: []
	});
	const [avatar, setAvatar] = React.useState<string>(useAvatar(user.avatar.base64));

	React.useEffect(() => {
		if ((conclusId === "NONE" || conclusId !== -1) && userId) {
			getOneUser(+userId)
				.then((data) => {
					const { success, message, error, person } = data;

					if (!success) {
						setText(message || error);
						navigate("/");
						return;
					}

					if (callback) callback();
					setUser(person);
					setAvatar(useAvatar(person.avatar.base64));
				});
		}
	}, [...deps]);

	return { user, setUser, avatar, setAvatar };
}

export default useUser;