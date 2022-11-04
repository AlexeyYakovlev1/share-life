import Button from "../../../../components/UI/Button/Button";
import Modal from "../../../../components/UI/Modal/Modal";
import AlertContext from "../../../../context/alert.context";
import classes from "../../Admin.module.sass";
import removeAdminAction from "../actions/remove.adminAction";
import { IModalChange } from "../Users/UserModalChange";
import { IPostActionInfo } from "./PagePosts";
import React from "react";

interface IPostModalRemove extends IModalChange {
	actionInfo: IPostActionInfo;
}

function PostModalRemove({ setClose, actionInfo }: IPostModalRemove) {
	const { setText } = React.useContext(AlertContext);

	function removePostClick() {
		removeAdminAction(actionInfo.postId, "POST", setText);
		setClose(true);
	}

	return (
		<Modal setClose={setClose}>
			<div className={classes.modalRemove}>
				<header className={classes.modalRemoveHeader}>
					<h3 className={classes.modalTitle}>Вы уверены?</h3>
					<p className={classes.modalDescription}>
						Пост по id {actionInfo.postId} будет полностью удален!
					</p>
				</header>
				<div className={classes.modalRemoveActions}>
					<Button onClick={removePostClick}>Да</Button>
					<Button
						className={classes.modalButtonActive}
						onClick={() => setClose(true)}
					>
						Нет
					</Button>
				</div>
			</div>
		</Modal>
	);
}

export default PostModalRemove;