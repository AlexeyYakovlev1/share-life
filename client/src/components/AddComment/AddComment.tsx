import React, { DetailedHTMLProps, FormHTMLAttributes } from "react";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import classes from "./AddComment.module.sass";
import cn from "classnames";
import AlertContext from "../../context/alert.context";
import LoaderContext from "../../context/loader.context";
import addComment from "../../http/comments/addComment.http";

interface IAddCommentProps extends DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
	postId: number;
}

function AddComment({ className, postId, ...props }: IAddCommentProps): JSX.Element {
	const [message, setMessage] = React.useState<string>("");

	const { setText } = React.useContext(AlertContext);
	const { setLoad } = React.useContext(LoaderContext);

	function submitAddComment(event: any) {
		event.preventDefault();

		setLoad(true);
		addComment(postId, { text: message })
			.then((data) => {
				const { success, error } = data;

				if (!success) {
					setText(error);
					setLoad(false);
					return;
				}

				// next is update info for post in reducer...
			});
		setLoad(false);
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