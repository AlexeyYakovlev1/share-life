import React, { DetailedHTMLProps, HTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { IPost } from "../../models/post.models";
import classes from "./PostMenu.module.sass";
import cn from "classnames";
import AlertContext from "../../context/alert.context";
import { useDispatch } from "react-redux";
import removePostAsyncAction from "../../redux/actions/async/posts/removePost";

interface IPostMenuProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	post: IPost;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
	visible: boolean;
}

function PostMenu({ post, setVisible, visible, className = "", ...props }: IPostMenuProps): JSX.Element {
	const { setText } = React.useContext(AlertContext);
	const dispatch: any = useDispatch();

	return (
		<div
			className={cn(classes.wrapper, className)}
			{...props}
		>
			<span
				className={classes.close}
				onClick={() => setVisible(!visible)}
			>
				&#x2715;
			</span>
			<ul className={classes.list}>
				<li className={classes.item}>
					<Link to="/settings?change=true">Change</Link>
				</li>
				<li
					onClick={() => dispatch(removePostAsyncAction(post.id, setText))}
					className={cn(classes.item, classes.itemDelete)}
				>
					Delete
				</li>
			</ul>
		</div>
	);
}

export default PostMenu;