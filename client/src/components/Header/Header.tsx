import Input from "../UI/Input/Input";
import classes from "./Header.module.sass";
import Logo from "./Logo";
import { ReactComponent as SearchIcon } from "../../assets/images/search.svg";
import { ReactComponent as LikeIcon } from "../../assets/images/heart.svg";
import { ReactComponent as PlusIcon } from "../../assets/images/plus.svg";
import { Link } from "react-router-dom";
import { DetailedHTMLProps, FunctionComponent, HTMLAttributes, SVGProps } from "react";
import cn from "classnames";
import Button from "../UI/Button/Button";
import { useSelector } from "react-redux";
import { IState } from "../../models/redux.models";
import useAvatar from "../../hooks/useAvatar";

interface IHeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> { }

function Header({ className }: IHeaderProps): JSX.Element {
	interface IMenu {
		name: string;
		url: string;
		img: FunctionComponent<SVGProps<SVGSVGElement>>;
	}
	const { info: { avatar, id, user_name }, isAuth } = useSelector((state: IState) => state.person);

	const currentAvatarUser = useAvatar(avatar);
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

	return (
		<header className={cn(classes.header, className)}>
			<div className={classes.container}>
				<Logo className={classes.logoHeader} />
				<div className={classes.search}>
					<span className={classes.searchIcon}>
						<SearchIcon />
					</span>
					<Input
						placeholder="Search"
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