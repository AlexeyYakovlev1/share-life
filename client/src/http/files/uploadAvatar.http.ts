import axios from "axios";
import Cookies from "js-cookie";
import { trackPromise } from "react-promise-tracker";

const { REACT_APP_API_URL } = process.env;

function uploadAvatar(formData: any, updateUser = false) {
	return trackPromise(axios({
		method: "POST",
		url: `${REACT_APP_API_URL}/upload/avatar/?update-user=${updateUser}`,
		headers: {
			Authorization: `Bearer ${Cookies.get("token")}`
		},
		data: formData
	})
		.then((response) => response.data)
		.catch((response) => response.data));
}

export default uploadAvatar;