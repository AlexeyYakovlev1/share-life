import Input from "../../../../components/UI/Input/Input";
import classes from "../../Admin.module.sass";
import React from "react";
import { IPerson } from "../../../../models/person.models";
import getAllUsers from "../../../../http/user/getAllUsers.http";
import AlertContext from "../../../../context/alert.context";
import UserItem from "./UserItem";
import searchUsersForAdmin from "../../../../http/user/searchUsersForAdmin.http";

function PageUsers() {
	const [users, setUsers] = React.useState<Array<IPerson>>([]);
	const { setText } = React.useContext(AlertContext);
	const tableTitles = ["id", "username", "email", "fullname", "edit", "delete"];

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

	React.useEffect(getUsers, []);

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

	return (
		<React.Fragment>
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
								<UserItem user={user} />
							</tr>
						))}
					</thead>
				</table> : <h3 className={classes.contentEmptyTitle}>Nothing found</h3>}
			</div>
		</React.Fragment>
	);
}

export default PageUsers;