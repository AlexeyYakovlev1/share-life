import { DetailedHTMLProps, HTMLAttributes } from "react";
import classes from "./Footer.module.sass";
import cn from "classnames";
import useTheme from "../../hooks/useTheme";

interface IFooterProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> { }

function Footer({ className }: IFooterProps): JSX.Element {
	const { light, dark } = useTheme();

	return (
		<footer className={cn(classes.footer, className, {
			[classes.light]: light,
			[classes.dark]: dark
		})}>
			<div className={classes.container}>
				<p className={classes.text}>
					Над этим проектом трудился <a href="https://github.com/AlexeyYakovlev1">Алексей Яковлев</a>
				</p>
			</div>
		</footer>
	);
}

export default Footer;