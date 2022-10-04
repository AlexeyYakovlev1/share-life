import classes from "./OpenPostLoading.module.sass";
import cn from "classnames";

function OpenPostLoading() {
	return (
		<div className={classes.wrapper}>
			<div className={cn(classes.left, classes.animate)}></div>
			<div className={classes.right}>
				<header className={classes.rightHeader}>
					<div className={classes.rightHeaderUser}>
						<div
							className={cn(classes.rightHeaderAvatar, classes.animate)}
						></div>
						<div className={classes.rightHeaderInfo}>
							<span
								className={cn(classes.rightHeaderInfoName, classes.animate)}
							></span>
							<span
								className={cn(classes.rightHeaderInfoLocation, classes.animate)}
							></span>
						</div>
					</div>
				</header>
			</div>
		</div>
	);
}

export default OpenPostLoading;