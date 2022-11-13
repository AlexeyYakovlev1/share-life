import Cookies from "js-cookie";
import { NavigateFunction } from "react-router-dom";
import login from "../../../../http/auth/login.http";
import { setUser } from "../../user.actions";

function loginAsyncAction(
	user: { email: string, password: string },
	setErrors: React.Dispatch<React.SetStateAction<boolean>>,
	setText: React.Dispatch<React.SetStateAction<string>>,
	navigation: NavigateFunction
) {
	return (dispatch: React.Dispatch<any>) => {
		login(user)
			.then((data) => {
				const { errors: dataErrors, success, message, error, token, person }: any = data;

				if (dataErrors && dataErrors.length) {
					setErrors((prevState) => !prevState);
					return;
				}

				if (!success) {
					if (message) {
						setText(`Ошибка сервера: ${message}`);
						return;
					}

					setText(error);
					return;
				}

				Cookies.set("token", token);
				dispatch(setUser(person));
				navigation("/");
			});
	};
}

export default loginAsyncAction;