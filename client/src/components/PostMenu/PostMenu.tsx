import { DetailedHTMLProps, HTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { IPost } from "../../models/post.models";
import classes from "./PostMenu.module.sass";
import cn from "classnames";

interface IPostMenuProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	post: IPost;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
	visible: boolean;
}

function PostMenu({ post, setVisible, visible, className = "", ...props }: IPostMenuProps): JSX.Element {
	function deletePost() {
		console.log(`Here we delete post by id ${post.id}`);
	}

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
					onClick={deletePost}
					className={cn(classes.item, classes.itemDelete)}
				>
					Delete
				</li>
			</ul>
		</div>
	);
}

export default PostMenu;