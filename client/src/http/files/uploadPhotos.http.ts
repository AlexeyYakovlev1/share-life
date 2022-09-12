import Cookies from "js-cookie";
import { trackPromise } from "react-promise-tracker";

const { REACT_APP_API_URL } = process.env;

function uploadPhotos(formData: any) {
	return trackPromise(fetch(`${REACT_APP_API_URL}/upload/photos`, {
		method: "POST",
		headers: {
			"Accept-Type": "application/json",
			Authorization: `Bearer ${Cookies.get("token") || ""}`,
		},
		body: formData
	})
		.then((response) => response.json())
		.then((data) => data));
}

export default uploadPhotos;