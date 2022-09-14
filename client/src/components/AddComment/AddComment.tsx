import React, { DetailedHTMLProps, FormHTMLAttributes } from "react";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import classes from "./AddComment.module.sass";
import cn from "classnames";
import AlertContext from "../../context/alert.context";
import addComment from "../../http/comments/addComment.http";

interface IAddCommentProps extends DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
	postId: number;
}

function AddComment({ className, postId, ...props }: IAddCommentProps): JSX.Element {
	const [message, setMessage] = React.useState<string>("");
	const { setText } = React.useContext(AlertContext);
	const disabled = (message.length < 6) || (message.length >= 100);

	function submitAddComment(event: any) {
		event.preventDefault();

		if (!message.trim().length) return;

		addComment(postId, { text: message })
			.then((data) => {
				const { success, error, message } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				setMessage("");
			});
	}

	return (
		<form
			onSubmit={submitAddComment}
			className={cn(classes.form, className)}
			{...props}
		>
			<Input
				placeholder="Add a comment..."
				value={message}
				onChange={(event) => setMessage(event.target.value)}
			/>
			<Button disabled={disabled}>Post</Button>
		</form>
	);
}

export default AddComment;