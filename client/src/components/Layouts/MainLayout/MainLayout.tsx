import React, { DetailedHTMLProps, HTMLAttributes } from "react";
import AlertContext from "../../../context/alert.context";
import LoaderContext from "../../../context/loader.context";
import Footer from "../../Footer/Footer";
import Header from "../../Header/Header";
import Alert from "../../UI/Alert/Alert";
import Loader from "../../UI/Loader/Loader";
import classes from "./MainLayout.module.sass";

interface IMainLayoutProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	children: React.ReactNode;
}

function MainLayout({ children }: IMainLayoutProps): JSX.Element {
	const { load } = React.useContext(LoaderContext);
	const { text } = React.useContext(AlertContext);

	return (
		<div className={classes.wrapper}>
			{load && <Loader />}
			{text && <Alert />}
			<Header className={classes.header} />
			<main className={classes.content}>
				<div className={classes.container}>{children}</div>
			</main>
			<Footer className={classes.footer} />
		</div>
	);
}

export default MainLayout;