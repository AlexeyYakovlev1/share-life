import uploadAvatar from "../../../../http/files/uploadAvatar.http";
import { IPerson } from "../../../../models/person.models";
import { setUser } from "../../user.actions";

function updateAvatarAsyncAction(
	event: any,
	setText: React.Dispatch<React.SetStateAction<string>>,
	info: IPerson
) {
	return (dispatch: React.Dispatch<any>) => {
		if (!event.target?.files.length) return;

		const file = event.target?.files[0];
		const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg"];

		if (!allowedTypes.includes(file.type)) {
			setText("Тип файла не поддерживается");
			return;
		}

		const formData = new FormData();
		formData.append("avatar", file);

		const reader: any = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = () => {
			uploadAvatar(formData, { updateUser: true, userId: -1 })
				.then((data) => {
					const { success, message, error, dataFile: { inBase64, filename } } = data;
					setText(message || error);
					if (!success) return;

					dispatch(setUser({ ...info, avatar: { base64: inBase64, filename } }));
				});
		};

		reader.onerror = () => {
			setText(reader.error.message);
			return;
		};
	};
}

export default updateAvatarAsyncAction;