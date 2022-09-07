import React, { DetailedHTMLProps, HTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { IPost } from "../../models/post.models";
import classes from "./PostMenu.module.sass";
import cn from "classnames";
import Cookies from "js-cookie";
import LoaderContext from "../../context/loader.context";
import AlertContext from "../../context/alert.context";

interface IPostMenuProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	post: IPost;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
	visible: boolean;
}

const { REACT_APP_API_URL } = process.env;

function PostMenu({ post, setVisible, visible, className = "", ...props }: IPostMenuProps): JSX.Element {
	const { setLoad } = React.useContext(LoaderContext);
	const { setText } = React.useContext(AlertContext);

	function deletePost() {
		setLoad(true);
		fetch(`${REACT_APP_API_URL}/posts/remove/${post.id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${Cookies.get("token")}`
			}
		})
			.then((response) => response.json())
			.then((data) => {
				const { message, error } = data;
				setText(message || error);
				setLoad(false);
			});
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