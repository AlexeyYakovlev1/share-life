import { Link, useSearchParams } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import useTheme from "../../hooks/useTheme";
import classes from "./Admin.module.sass";
import cn from "classnames";
import PageComments from "./Pages/Comments/PageComments";
import useAccessAdmin from "../../hooks/access/useAccessAdmin";
import PageUsers from "./Pages/Users/PageUsers";
import PagePosts from "./Pages/Posts/PagePosts";

export interface IActionInfo {
	remove: boolean;
	change: boolean;
}

export interface IPageItem {
	setClose: React.Dispatch<React.SetStateAction<boolean>>;
}

function Admin() {
	const { light, dark } = useTheme();
	const allowedPages = ["users", "posts", "comments"];
	const [searchParams, setSearchParams] = useSearchParams();
	const page = searchParams.get("page");
	const pageUsers = page === "users";
	const pagePosts = page === "posts";
	const pageComments = page === "comments";

	useAccessAdmin();

	if (!page) {
		return (
			<MainLayout>
				<h1 className={cn(classes.emptyTitle, {
					[classes.light]: light,
					[classes.dark]: dark
				})}>
					The query `page` should contain
					something from this: {allowedPages.join(", ")}
				</h1>
			</MainLayout>
		);
	}

	return (
		<MainLayout>
			<article className={cn(classes.wrapper, {
				[classes.light]: light,
				[classes.dark]: dark
			})}>
				<header className={classes.header}>
					<nav className={classes.navbar}>
						<ul className={classes.navbarList}>
							<li className={cn(classes.navbarListItem, {
								[classes.active]: pageUsers
							})}>
								<Link to="/admin/?page=users">Пользователи</Link>
							</li>
							<li className={cn(classes.navbarListItem, {
								[classes.active]: pagePosts
							})}>
								<Link to="/admin/?page=posts">Посты</Link>
							</li>
							<li className={cn(classes.navbarListItem, {
								[classes.active]: pageComments
							})}>
								<Link to="/admin/?page=comments">Комментарии</Link>
							</li>
						</ul>
					</nav>
				</header>
				<div className={classes.content}>
					{pageUsers && <PageUsers />}
					{pagePosts && <PagePosts />}
					{pageComments && <PageComments />}
				</div>
			</article>
		</MainLayout>
	);
}

export default Admin;