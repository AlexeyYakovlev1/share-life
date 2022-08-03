import { DetailedHTMLProps, FormHTMLAttributes } from "react";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import classes from "./AddComment.module.sass";
import cn from "classnames";

interface IAddCommentProps extends DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> { }

function AddComment({ className, ...props }: IAddCommentProps): JSX.Element {
	return (
		<form className={cn(classes.form, className)} {...props}>
			<Input
				placeholder="Add a comment..."
			/>
			<Button>Post</Button>
		</form>
	);
}

export default AddComment;