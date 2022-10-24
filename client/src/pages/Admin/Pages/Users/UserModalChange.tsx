import classes from "../../Admin.module.sass";
import React from "react";
import { IPerson } from "../../../../models/person.models";
import useAvatar from "../../../../hooks/useAvatar";
import Modal from "../../../../components/UI/Modal/Modal";
import Input from "../../../../components/UI/Input/Input";
import Button from "../../../../components/UI/Button/Button";
import getOneUser from "../../../../http/user/getOneUser.http";
import AlertContext from "../../../../context/alert.context";
import Label from "../../../../components/UI/Label/Label";
import { IUserActionInfo } from "./PageUsers";
import { ReactComponent as CrossIcon } from "../../../../assets/images/close.svg";
import uploadImages from "../../../../utils/uploadImages.util";
import readerImages from "../../../../utils/readerImages.util";
import uploadAvatar from "../../../../http/files/uploadAvatar.http";

export interface IModalChange {
	setClose: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IUserModalChange extends IModalChange {
	actionInfo: IUserActionInfo;
}

function UserModalChange({ setClose, actionInfo }: IUserModalChange) {
	const { setText } = React.useContext(AlertContext);
	const avatarRef = React.useRef<HTMLInputElement | null>(null);

	const [currentUser, setCurrentUser] = React.useState<IPerson>({
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
	const currentUserAvatar = useAvatar(currentUser.avatar.base64);
	const [addRole, setAddRole] = React.useState<boolean>(false);
	const [selectFile, setSelectFile] = React.useState<any>([]);
	const [avatar, setAvatar] = React.useState<any>([currentUserAvatar]);
	const [roleValue, setRoleValue] = React.useState<string>("");

	React.useEffect(() => {
		readerImages(selectFile, setAvatar, setText, true);
	}, [selectFile]);

	React.useEffect(() => {
		if (actionInfo.userId === -1) return;

		getOneUser(actionInfo.userId)
			.then((data) => {
				const { success, message, error, person } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				setCurrentUser(person);
				setAvatar([useAvatar(person.avatar.base64)]);
			});
	}, [actionInfo]);

	function changeSubmit() {
		// send photo
		const formData = new FormData();
		formData.append("avatar", selectFile[0]);

		uploadAvatar(formData, { updateUser: true, userId: actionInfo.userId })
			.then((data) => {
				const { success, message, error, dataFile } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				setCurrentUser({
					...currentUser, avatar: dataFile
				});
			});

		// send updated user
		// ...code
	}

	function addRoleHandler(event: React.FormEvent<HTMLInputElement> | any) {
		if (event.key === "Enter") {
			if (currentUser.roles.includes(roleValue.toUpperCase())) {
				setText("This role exist");
				return;
			}

			setCurrentUser({
				...currentUser, roles: currentUser.roles.concat(roleValue.toUpperCase())
			});
			setRoleValue("");
		}
	}

	function removeRoleClick(role: string) {
		setCurrentUser({
			...currentUser, roles: currentUser.roles.filter((r) => r !== role)
		});
	}

	return (
		<Modal setClose={setClose}>
			<div className={classes.modalChange}>
				<header className={classes.modalChangeHeader}>
					<h3 className={classes.modalChangeTitle}>
						Edit user by id {actionInfo.userId}
					</h3>
				</header>
				<div
					className={classes.modalChangeContent}
				>
					<div className={classes.modalChangeContentInput}>
						<Label htmlFor="roles">Roles</Label>
						<ul className={classes.modalChangeContentInputRoles}>
							{currentUser.roles.map((role, index) => (
								<li key={`${role}_${index + 1}`}>
									{role}
									<span onClick={() => removeRoleClick(role)}>
										<CrossIcon title="Remove this role" />
									</span>
								</li>
							))}
						</ul>
						<div className={classes.modalChangeContentInputAddRole}>
							{
								addRole &&
								<Input
									onKeyPress={addRoleHandler}
									type="text"
									placeholder="Write name of role"
									value={roleValue}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRoleValue(event.target.value)}
								/>
							}
							<Button
								className={classes.modalChangeContentInputAddRoleBtn}
								onClick={() => setAddRole(!addRole)}
							>
								{!addRole ? "Add role" : "Close"}
							</Button>
						</div>
					</div>
					<div className={classes.modalChangeContentInput}>
						<Label htmlFor="fullname">Fullname</Label>
						<Input
							id="fullname"
							type="text"
							placeholder="Fullname"
							value={currentUser.full_name}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCurrentUser({ ...currentUser, full_name: event.target.value })}
						/>
					</div>
					<div className={classes.modalChangeContentInput}>
						<Label htmlFor="username">Username</Label>
						<Input
							id="username"
							type="text"
							placeholder="Username"
							value={currentUser.user_name}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCurrentUser({ ...currentUser, user_name: event.target.value })}
						/>
					</div>
					<div className={classes.modalChangeContentInput}>
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="text"
							placeholder="Email"
							value={currentUser.email}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCurrentUser({ ...currentUser, email: event.target.value })}
						/>
					</div>
					<div className={classes.modalChangeContentInput}>
						<Label htmlFor="avatar">Avatar</Label>
						<div className={classes.modalChangeContentAvatar}>
							<input
								ref={avatarRef}
								type="file"
								hidden
								accept="image/*"
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => uploadImages(event, setSelectFile, setText)}
							/>
							<Button onClick={() => avatarRef.current?.click()}>Upload photo</Button>
							<div
								style={{ backgroundImage: `url(${avatar[0].base64 || avatar[0]})` }}
								className={classes.modalChangeContentAvatarImage}
							></div>
						</div>
					</div>
					<Button type="submit" onClick={changeSubmit}>Done</Button>
				</div>
			</div>
		</Modal>
	);
}

export default UserModalChange;