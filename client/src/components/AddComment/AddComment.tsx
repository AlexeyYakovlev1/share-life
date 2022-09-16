import React, { DetailedHTMLProps, FormHTMLAttributes } from "react";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import classes from "./AddComment.module.sass";
import cn from "classnames";
import AlertContext from "../../context/alert.context";
import addComment from "../../http/comments/addComment.http";
import socket from "socket.io-client";
import { IComment } from "../../models/post.models";

interface IAddCommentProps extends DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
	postId: number;
	setComments: React.Dispatch<React.SetStateAction<Array<IComment>>>;
	comments: Array<IComment>;
}

const { REACT_APP_API_URL } = process.env;

function AddComment({ className, postId, setComments, comments, ...props }: IAddCommentProps): JSX.Element {
	const [message, setMessage] = React.useState<{ text: string, submit: boolean }>({ text: "", submit: false });
	const { setText } = React.useContext(AlertContext);
	const disabled = (message.text.length < 6) || (message.text.length >= 100);

	// give comment data
	function submitAddComment(event: any) {
		event.preventDefault();

		if (!message.text.trim().length) return;

		addComment(postId, { text: message.text })
			.then((data) => {
				const { success, error, message } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				setMessage({ text: "", submit: true });
			});
	}

	// get comment
	React.useEffect(() => {
		if (!message.submit) return;

		const io: any = socket;
		const socketConnect = io.connect(REACT_APP_API_URL);

		socketConnect.on("comment", (data: any) => {
			setComments([...comments, data]);
		});
	}, [message]);

	return (
		<form
			onSubmit={submitAddComment}
			className={cn(classes.form, className)}
			{...props}
		>
			<Input
				placeholder="Add a comment..."
				value={message.text}
				onChange={(event) => setMessage({ ...message, text: event.target.value })}
			/>
			<Button disabled={disabled}>Post</Button>
		</form>
	);
}

export default AddComment;