import Modal from "../../../../components/UI/Modal/Modal";
import { IModalChange } from "./UserModalChange";
import classes from "../../Admin.module.sass";
import { IUserActionInfo } from "./PageUsers";
import Button from "../../../../components/UI/Button/Button";
import removeAdminAction from "../actions/remove.adminAction";
import AlertContext from "../../../../context/alert.context";
import React from "react";

interface IUserModalRemove extends IModalChange {
	actionInfo: IUserActionInfo;
}

function UserModalRemove({ setClose, actionInfo }: IUserModalRemove) {
	const { setText } = React.useContext(AlertContext);

	function removeUserClick() {
		removeAdminAction(actionInfo.userId, "USER", setText);
		setClose(true);
	}

	return (
		<Modal setClose={setClose}>
			<div className={classes.modalRemove}>
				<header className={classes.modalRemoveHeader}>
					<h3 className={classes.modalTitle}>You sure?</h3>
					<p className={classes.modalDescription}>
						User by id {actionInfo.userId} will be removed full!
					</p>
				</header>
				<div className={classes.modalRemoveActions}>
					<Button
						onClick={removeUserClick}
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
		</Modal>
	);
}

export default UserModalRemove;