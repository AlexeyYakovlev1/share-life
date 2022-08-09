import { Triangle } from "react-loader-spinner";
import classes from "./Loader.module.sass";

function Loader(): JSX.Element {
	return (
		<div className={classes.wrapper}>
			<div className={classes.loader}>
				<Triangle
					color="#C42F5A"
					height="80"
					width="80"
				/>
			</div>
		</div>
	);
}

export default Loader;