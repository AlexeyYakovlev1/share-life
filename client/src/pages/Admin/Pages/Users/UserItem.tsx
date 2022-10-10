import { IPerson } from "../../../../models/person.models";
import classes from "../../Admin.module.sass";
import React from "react";
import Button from "../../../../components/UI/Button/Button";

function UserItem({ user }: { user: IPerson }) {
	return (
		<React.Fragment>
			<td className={classes.contentItem}>{user.id}</td>
			<td className={classes.contentItem}>{user.user_name}</td>
			<td className={classes.contentItem}>{user.email}</td>
			<td className={classes.contentItem}>{user.full_name}</td>
			<td className={classes.contentItem}>
				<Button>Edit</Button>
			</td>
			<td className={classes.contentItem}>
				<Button>Delete</Button>
			</td>
		</React.Fragment>
	);
}

export default UserItem;