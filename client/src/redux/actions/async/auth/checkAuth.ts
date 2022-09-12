import { setUser } from "../../user.actions";
import Cookies from "js-cookie";
import checkAuth from "../../../../http/auth/checkAuth.http";

function checkAuthAsyncAction() {
	return (dispatch: React.Dispatch<any>) => {
		checkAuth()
			.then((data) => {
				const { token, person, success } = data;

				if (!success) return;

				Cookies.set("token", token);
				dispatch(setUser(person));
			});
	};
}

export default checkAuthAsyncAction;