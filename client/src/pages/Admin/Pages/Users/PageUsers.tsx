import Input from "../../../../components/UI/Input/Input";
import classes from "../../Admin.module.sass";
import React from "react";
import { IPerson } from "../../../../models/person.models";
import getAllUsers from "../../../../http/user/getAllUsers.http";
import AlertContext from "../../../../context/alert.context";
import UserItem from "./UserItem";
import searchUsersForAdmin from "../../../../http/user/searchUsersForAdmin.http";
import Modal from "../../../../components/UI/Modal/Modal";
import Button from "../../../../components/UI/Button/Button";
import removeUser from "../../../../http/admin/removeUserAdmin.http";
import { IActionInfo } from "../../Admin";

export interface IUserActionInfo extends IActionInfo {
	userId: number;
}

function PageUsers() {
	const [users, setUsers] = React.useState<Array<IPerson>>([]);
	const [close, setClose] = React.useState<boolean>(true);
	const [actionInfo, setActionInfo] = React.useState<IUserActionInfo>({
		userId: -1, remove: false, change: false
	});

	const { setText } = React.useContext(AlertContext);
	const tableTitles = ["id", "username", "email", "fullname", "edit", "delete"];

	React.useEffect(getUsers, []);

	function getUsers() {
		getAllUsers()
			.then((data) => {
				const { success, message, error, persons } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				setUsers(persons);
			});
	}

	function searchUsersHandler(event: any) {
		if (event.key !== "Enter") return;

		if (!event.target?.value) {
			getUsers();
			return;
		}

		searchUsersForAdmin(event.target?.value)
			.then((data) => {
				const { success, message, error, person } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				if (person === undefined) {
					setUsers([]);
					return;
				}

				setUsers([person]);
			});
	}

	function removeUserClick() {
		if (actionInfo.userId === -1) return;

		removeUser(actionInfo.userId)
			.then((data) => {
				const { success, message, error } = data;
				setText(message || error);
				if (!success) return;
				setClose(true);
			});
	}

	function changeUserClick() {
		console.log("change user...");
	}

	return (
		<React.Fragment>
			{!close && <Modal setClose={setClose}>
				<div className={classes.modal}>
					<header className={classes.modalHeader}>
						<h3 className={classes.modalTitle}>You sure?</h3>
						<p className={classes.modalDescription}>
							User by id {actionInfo.userId} will be removed full!
						</p>
					</header>
					<div className={classes.modalActions}>
						<Button
							onClick={actionInfo.remove ? removeUserClick : changeUserClick}
						>
							Yes
						</Button>
						<Button
							className={classes.modalButtonActive}
							onClick={() => setClose(true)}
						>
							No
						</Button>
					</div>
				</div>
			</Modal>}
			<header className={classes.contentHeader}>
				<Input
					type="text"
					placeholder="Write id user"
					className={classes.contentSearch}
					onKeyDown={searchUsersHandler}
				/>
			</header>
			<div className={classes.contentBody}>
				{users.length ? <table className={classes.contentList}>
					<thead>
						<tr>
							{tableTitles.map((title: string, index: number) => (
								<th
									key={`${title[title.length - 1]}_${index + 1}`}
									className={classes.contentListTitle}
								>
									{title.toUpperCase()}
								</th>
							))}
						</tr>
						{users.map((user: IPerson) => (
							<tr key={user.id}>
								<UserItem setActionInfo={setActionInfo} setClose={setClose} user={user} />
							</tr>
						))}
					</thead>
				</table> : <h3 className={classes.contentEmptyTitle}>Nothing found</h3>}
			</div>
		</React.Fragment>
	);
}

export default PageUsers;