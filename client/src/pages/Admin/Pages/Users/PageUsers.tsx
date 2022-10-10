import Input from "../../../../components/UI/Input/Input";
import classes from "../../Admin.module.sass";
import React from "react";
import Button from "../../../../components/UI/Button/Button";
import { IPerson } from "../../../../models/person.models";
import getAllUsers from "../../../../http/user/getAllUsers.http";
import AlertContext from "../../../../context/alert.context";
import UserItem from "./UserItem";

function PageUsers() {
	const [users, setUsers] = React.useState<Array<IPerson>>([]);
	const { setText } = React.useContext(AlertContext);
	const tableTitles = ["id", "username", "email", "fullname", "edit", "delete"];

	React.useEffect(() => {
		getAllUsers()
			.then((data) => {
				const { success, message, error, persons } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				setUsers(persons);
			});
	}, []);

	return (
		<React.Fragment>
			<header className={classes.contentHeader}>
				<Input
					type="text"
					placeholder="Write id user"
					className={classes.contentSearch}
				/>
				<Button>Find</Button>
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