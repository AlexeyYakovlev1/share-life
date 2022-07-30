import React, { DetailedHTMLProps, HTMLAttributes } from "react";
import Footer from "../../Footer/Footer";
import Header from "../../Header/Header";
import classes from "./MainLayout.module.sass";

interface IMainLayoutProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	children: React.ReactNode;
}

function MainLayout({ children }: IMainLayoutProps): JSX.Element {
	return (
		<div className={classes.wrapper}>
			<Header className={classes.header} />
			<main className={classes.content}>
				<div className={classes.container}>{children}</div>
			</main>
			<Footer className={classes.footer} />
		</div>
	);
}

export default MainLayout;