import classes from "./HomePostLoading.module.sass";
import cn from "classnames";

function HomePostLoading() {
	return (
		<li className={classes.wrapper}>
			<header className={classes.header}>
				<div className={classes.headerLeft}>
					<div
						className={cn(classes.headerLeftAvatar, classes.animate)}
					></div>
					<div className={classes.headerLeftInfo}>
						<span
							className={cn(classes.headerLeftInfoName, classes.animate)}
						></span>
						<span
							className={cn(classes.headerLeftInfoLocation, classes.animate)}
						></span>
					</div>
				</div>
			</header>
			<div className={cn(classes.body, classes.animate)}></div>
		</li>
	);
}

export default HomePostLoading;