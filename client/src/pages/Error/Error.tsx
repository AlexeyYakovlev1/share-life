import { Link } from "react-router-dom";
import Button from "../../components/UI/Button/Button";
import useTheme from "../../hooks/useTheme";
import classes from "./Error.module.sass";
import cn from "classnames";

function Error(): JSX.Element {
	const { light, dark } = useTheme();

	return (
		<article className={cn(classes.wrapper, {
			[classes.light]: light,
			[classes.dark]: dark
		})}>
			<div className={classes.info}>
				<h1 className={classes.title}>404</h1>
				<h2 className={classes.subtitle}>Oops! Page not found</h2>
				<p className={classes.description}>
					Sorry, the page you`re looking for doesn`t exist. If you think
					something is broken, report a problem.
				</p>
			</div>
			<Button>
				<Link to="/">Return home</Link>
			</Button>
		</article>
	);
}

export default Error;