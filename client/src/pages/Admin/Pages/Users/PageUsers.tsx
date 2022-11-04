import Input from "../../../../components/UI/Input/Input";
import classes from "../../Admin.module.sass";
import React from "react";
import { IPerson } from "../../../../models/person.models";
import AlertContext from "../../../../context/alert.context";
import UserItem from "./UserItem";
import { IActionInfo } from "../../Admin";
import searchAdminAction from "../actions/search.adminAction";
import getAdminAction from "../actions/get.adminAction";
import UserModalChange from "./UserModalChange";
import UserModalRemove from "./UserModalRemove";

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
		getAdminAction("USER", setUsers, setText);
	}

	function searchUsersHandler(event: any) {
		if (event.key !== "Enter") return;

		if (!event.target?.value) {
			getUsers();
			return;
		}

		searchAdminAction(event, "USER", setText, setUsers);
	}

	return (
		<React.Fragment>
			{(!close && actionInfo.change) &&
				<UserModalChange setClose={setClose} actionInfo={actionInfo} />
			}
			{(!close && actionInfo.remove) &&
				<UserModalRemove setClose={setClose} actionInfo={actionInfo} />
			}
			<header className={classes.contentHeader}>
				<Input
					type="text"
					placeholder="Напишите id пользователя"
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
				</table> : <h3 className={classes.contentEmptyTitle}>Ничего не найдено</h3>}
			</div>
		</React.Fragment>
	);
}

export default PageUsers;