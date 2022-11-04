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
				<h2 className={classes.subtitle}>Уупс! Страница не найдена</h2>
				<p className={classes.description}>
					Извините, страница, которую вы ищете, не существует. Если вы считаете
					что-то сломалось, сообщите о проблеме.
				</p>
			</div>
			<Button>
				<Link to="/">Вернуться домой</Link>
			</Button>
		</article>
	);
}

export default Error;