import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import classes from "./Settings.module.sass";

function Settings(): JSX.Element {
	return (
		<MainLayout>
			<div className={classes.wrapper}>
				<h1>Settings page</h1>
			</div>
		</MainLayout>
	);
}

export default Settings;