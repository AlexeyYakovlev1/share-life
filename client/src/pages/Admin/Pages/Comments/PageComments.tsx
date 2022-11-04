import Input from "../../../../components/UI/Input/Input";
import classes from "../../Admin.module.sass";
import React from "react";
import AlertContext from "../../../../context/alert.context";
import { IComment } from "../../../../models/post.models";
import CommentItem from "./CommentItem";
import Modal from "../../../../components/UI/Modal/Modal";
import Button from "../../../../components/UI/Button/Button";
import { IActionInfo } from "../../Admin";
import removeAdminAction from "../actions/remove.adminAction";
import searchAdminAction from "../actions/search.adminAction";
import getAdminAction from "../actions/get.adminAction";

export interface ICommentActionInfo extends IActionInfo {
	commentId: number;
}

function PageComments() {
	const tableTitles = ["id", "text", "author id", "post id", "delete"];
	const { setText } = React.useContext(AlertContext);

	const [comments, setComments] = React.useState<Array<IComment>>([]);
	const [close, setClose] = React.useState<boolean>(true);
	const [actionInfo, setActionInfo] = React.useState<ICommentActionInfo>({
		commentId: -1, remove: false, change: false
	});

	React.useEffect(getComments, []);

	function getComments() {
		getAdminAction("COMMENT", setComments, setText);
	}

	function searchCommentsHandler(event: any) {
		if (event.key !== "Enter") return;

		if (!event.target?.value) {
			getComments();
			return;
		}

		searchAdminAction(event, "COMMENT", setText, setComments);
	}

	function removeCommentClick() {
		removeAdminAction(actionInfo.commentId, "COMMENT", setText);
		setClose(true);
	}

	return (
		<React.Fragment>
			{!close && <Modal setClose={setClose}>
				<div className={classes.modal}>
					<header className={classes.modalHeader}>
						<h3 className={classes.modalTitle}>Вы уверены?</h3>
						<p className={classes.modalDescription}>
							Комментарий по id {actionInfo.commentId} будет удален полностью!
						</p>
					</header>
					<div className={classes.modalActions}>
						<Button
							onClick={removeCommentClick}
						>
							Да
						</Button>
						<Button
							className={classes.modalButtonActive}
							onClick={() => setClose(true)}
						>
							Нет
						</Button>
					</div>
				</div>
			</Modal>}
			<header className={classes.contentHeader}>
				<Input
					type="text"
					placeholder="Напишите id комментария"
					className={classes.contentSearch}
					onKeyDown={searchCommentsHandler}
				/>
			</header>
			<div className={classes.contentBody}>
				{comments.length ? <table className={classes.contentList}>
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
						{comments.map((comment: IComment) => (
							<tr key={comment.id}>
								<CommentItem setActionInfo={setActionInfo} setClose={setClose} comment={comment} />
							</tr>
						))}
					</thead>
				</table> : <h3 className={classes.contentEmptyTitle}>Ничего не найдено</h3>}
			</div>
		</React.Fragment>
	);
}

export default PageComments;