import Input from "../UI/Input/Input";
import classes from "./Header.module.sass";
import Logo from "./Logo";
import { ReactComponent as SearchIcon } from "../../assets/images/search.svg";
import { ReactComponent as UserIcon } from "../../assets/images/user.svg";
import { ReactComponent as LikeIcon } from "../../assets/images/heart.svg";
import { Link } from "react-router-dom";
import { DetailedHTMLProps, FunctionComponent, HTMLAttributes, SVGProps } from "react";
import cn from "classnames";
import Button from "../UI/Button/Button";

interface IHeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> { }

function Header({ className }: IHeaderProps): JSX.Element {
	interface IMenu {
		name: string;
		url: string;
		img: FunctionComponent<SVGProps<SVGSVGElement>>;
	}

	const isAuth = false;
	const menu: Array<IMenu> = [
		{
			name: "Likes",
			url: "/likes",
			img: LikeIcon
		},
		{
			name: "Profile",
			url: "/profile/:id",
			img: UserIcon
		},
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