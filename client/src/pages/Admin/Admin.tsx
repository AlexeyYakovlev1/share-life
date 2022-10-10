import { Link, useSearchParams } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import useTheme from "../../hooks/useTheme";
import classes from "./Admin.module.sass";
import cn from "classnames";
import PageUsers from "./Pages/Users/PageUsers";
import PagePosts from "./Pages/Posts/PagePosts";
import PageComments from "./Pages/Comments/PageComments";

function Admin() {
	const { light, dark } = useTheme();
	const allowedPages = ["users", "posts", "comments"];
	const [searchParams, setSearchParams] = useSearchParams();
	const page = searchParams.get("page");
	const pageUsers = page === "users";
	const pagePosts = page === "posts";
	const pageComments = page === "comments";

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
			<div className={cn(classes.wrapper, {
				[classes.light]: light,
				[classes.dark]: dark
			})}>
				<header className={classes.header}>
					<nav className={classes.navbar}>
						<ul className={classes.navbarList}>
							<li className={cn(classes.navbarListItem, {
								[classes.active]: pageUsers
							})}>
								<Link to="/admin/?page=users">Users</Link>
							</li>
							<li className={cn(classes.navbarListItem, {
								[classes.active]: pagePosts
							})}>
								<Link to="/admin/?page=posts">Posts</Link>
							</li>
							<li className={cn(classes.navbarListItem, {
								[classes.active]: pageComments
							})}>
								<Link to="/admin/?page=comments">Comments</Link>
							</li>
						</ul>
					</nav>
				</header>
				<div className={classes.content}>
					{pageUsers && <PageUsers />}
					{pagePosts && <PagePosts />}
					{pageComments && <PageComments />}
				</div>
			</div>
		</MainLayout>
	);
}

export default Admin;