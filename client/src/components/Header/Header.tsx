import Input from "../UI/Input/Input";
import classes from "./Header.module.sass";
import Logo from "./Logo";
import { ReactComponent as SearchIcon } from "../../assets/images/search.svg";
import { ReactComponent as PlusIcon } from "../../assets/images/plus.svg";
import { Link } from "react-router-dom";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";
import cn from "classnames";
import Button from "../UI/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "../../models/redux.models";
import useAvatar from "../../hooks/user/useAvatar";
import AlertContext from "../../context/alert.context";
import getAllPosts from "../../http/posts/getAllPosts.http";
import { setPosts } from "../../redux/actions/posts.actions";
import searchPostsByKeyWords from "../../http/posts/searchPosts.http";
import useTheme from "../../hooks/useTheme";

interface IHeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> { }

function Header({ className }: IHeaderProps): JSX.Element {
	const { light, dark } = useTheme();

	const { info: { avatar, id }, isAuth } = useSelector((state: IState) => state.person);
	const [searchVal, setSearchVal] = React.useState<string>("");
	const dispatch = useDispatch();

	const { setText } = React.useContext(AlertContext);

	const currentAvatarUser = useAvatar(avatar.base64);

	// search
	function searchHandler(event: any) {
		const key = event.key;

		if (key !== "Enter") return;
		if (!searchVal.length) {
			getAllPosts({ limit: 2, page: 0 })
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
		<header className={cn(classes.header, className, {
			[classes.light]: light,
			[classes.dark]: dark
		})}>
			<div className={classes.container}>
				<Logo className={classes.logoHeader} />
				<div className={classes.search}>
					<span className={classes.searchIcon}>
						<SearchIcon />
					</span>
					<Input
						value={searchVal}
						onChange={(event) => setSearchVal(event.target.value)}
						placeholder="?????????? ????????????"
						onKeyPress={searchHandler}
					/>
				</div>
				<div className={classes.user}>
					{isAuth ?
						<nav className={classes.nav}>
							<ul className={classes.list}>
								<li className={classes.item}>
									<Link title={"???????????????? ????????"} to={"/write"}>
										<PlusIcon />
									</Link>
								</li>
								<li className={cn(classes.item, classes.itemUser)}>
									<Link title="????????????????????????" to={`/profile/${id}`}>
										<div
											style={{ backgroundImage: `url(${currentAvatarUser})` }}
											className={classes.itemUserAvatar}
										></div>
									</Link>
								</li>
							</ul>
						</nav>
						:
						<Button><Link to="/auth/login">??????????</Link></Button>
					}
				</div>
			</div>
		</header>
	);
}

export default Header;