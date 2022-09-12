import Input from "../UI/Input/Input";
import classes from "./Header.module.sass";
import Logo from "./Logo";
import { ReactComponent as SearchIcon } from "../../assets/images/search.svg";
import { ReactComponent as LikeIcon } from "../../assets/images/heart.svg";
import { ReactComponent as PlusIcon } from "../../assets/images/plus.svg";
import { Link } from "react-router-dom";
import React, { DetailedHTMLProps, FunctionComponent, HTMLAttributes, SVGProps } from "react";
import cn from "classnames";
import Button from "../UI/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "../../models/redux.models";
import useAvatar from "../../hooks/useAvatar";
import AlertContext from "../../context/alert.context";
import getAllPosts from "../../http/posts/getAllPosts.http";
import { setPosts } from "../../redux/actions/posts.actions";
import searchPostsByKeyWords from "../../http/posts/search.http";

interface IHeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> { }

const { REACT_APP_API_URL } = process.env;

function Header({ className }: IHeaderProps): JSX.Element {
	interface IMenu {
		name: string;
		url: string;
		img: FunctionComponent<SVGProps<SVGSVGElement>>;
	}
	const { info: { avatar, id, user_name }, isAuth } = useSelector((state: IState) => state.person);
	const [searchVal, setSearchVal] = React.useState<string>("");
	const dispatch = useDispatch();
	const { setText } = React.useContext(AlertContext);

	const currentAvatarUser = useAvatar(avatar.base64);
	const menu: Array<IMenu> = [
		{
			name: "Add post",
			url: "/write",
			img: PlusIcon
		},
		{
			name: "Likes",
			url: "/likes",
			img: LikeIcon
		}
	];

	// search
	function searchHandler(event: any) {
		const key = event.key;

		if (key !== "Enter") return;
		if (!searchVal.length) {
			getAllPosts()
				.then((data) => {
					const { success, message, error, posts } = data;

					if (!success) {
						setText(message || error);
						return;
					}

					dispatch(setPosts(posts));
				});
		}

		searchPostsByKeyWords(searchVal)
			.then((data) => {
				const { success, message, error, posts } = data;

				setText(message || error);

				if (!success) return;
				dispatch(setPosts(posts));
			});
	}

	return (
		<header className={cn(classes.header, className)}>
			<div className={classes.container}>
				<Logo className={classes.logoHeader} />
				<div className={classes.search}>
					<span className={classes.searchIcon}>
						<SearchIcon />
					</span>
					<Input
						value={searchVal}
						onChange={(event) => setSearchVal(event.target.value)}
						placeholder="Search"
						onKeyPress={searchHandler}
					/>
				</div>
				<div className={classes.user}>
					{isAuth ? <nav className={classes.nav}>
						<ul className={classes.list}>
							{menu.map((item: IMenu) => (
								<li key={item.url} className={classes.item}>
									<Link title={item.name} to={item.url}>
										<item.img />
									</Link>
								</li>
							))}
							<li className={cn(classes.item, classes.itemUser)}>
								<Link title="user" to={`/profile/${id}`}>
									<img src={currentAvatarUser} title={`Avatar ${user_name}`} />
								</Link>
							</li>
						</ul>
					</nav>
						:
						<Button><Link to="/auth/login">Log in</Link></Button>
					}
				</div>
			</div>
		</header>
	);
}

export default Header;