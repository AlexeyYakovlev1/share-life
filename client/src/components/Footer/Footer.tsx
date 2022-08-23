import { DetailedHTMLProps, HTMLAttributes } from "react";
import classes from "./Footer.module.sass";
import cn from "classnames";

interface IFooterProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> { }

function Footer({ className }: IFooterProps): JSX.Element {
	return (
		<footer className={cn(classes.footer, className)}>
			<div className={classes.container}>
				<p className={classes.text}>
					This project was created by <a href="https://github.com/AlexeyYakovlev1">Alexey Yakovlev</a>
				</p>
			</div>
		</footer>
	);
}

export default Footer;