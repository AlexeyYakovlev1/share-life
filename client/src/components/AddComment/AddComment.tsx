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

	function submitAddComment(event: any) {
		event.preventDefault();

		addComment(postId, { text: message })
			.then((data) => {
				const { success, error, message } = data;

				if (!success) {
					setText(error || message);
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
			<Button>Post</Button>
		</form>
	);
}

export default AddComment;