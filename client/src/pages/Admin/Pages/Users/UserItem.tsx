import { IPerson } from "../../../../models/person.models";
import classes from "../../Admin.module.sass";
import React from "react";
import Button from "../../../../components/UI/Button/Button";
import { IUserActionInfo } from "./PageUsers";
import { IPageItem } from "../../Admin";
import { Link } from "react-router-dom";

interface IUserItem extends IPageItem {
	setActionInfo: React.Dispatch<React.SetStateAction<IUserActionInfo>>;
	user: IPerson;
}

function UserItem({ setActionInfo, setClose, user }: IUserItem) {
	function removeClick() {
		setClose(false);
		setActionInfo((prevState) => ({
			...prevState, userId: user.id, remove: true, change: false
		}));
	}

	function changeClick() {
		setClose(false);
		setActionInfo((prevState) => ({
			...prevState, userId: user.id, remove: false, change: true
		}));
	}

	return (
		<React.Fragment>
			<td className={classes.contentItem}>
				<Link to={`/profile/${user.id}`}>{user.id}</Link>
			</td>
			<td className={classes.contentItem}>{user.user_name}</td>
			<td className={classes.contentItem}>{user.email}</td>
			<td className={classes.contentItem}>{user.full_name}</td>
			<td className={classes.contentItem}>
				<Button
					onClick={changeClick}
				>
					Изменить
				</Button>
			</td>
			<td className={classes.contentItem}>
				<Button
					onClick={removeClick}
				>
					Удалить
				</Button>
			</td>
		</React.Fragment>
	);
}

export default UserItem;