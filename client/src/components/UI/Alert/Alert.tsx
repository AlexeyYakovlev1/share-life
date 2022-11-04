import React from "react";
import classes from "./Alert.module.sass";
import AlertContext from "../../../context/alert.context";
import Button from "../Button/Button";
import useTheme from "../../../hooks/useTheme";
import cn from "classnames";

function Alert(): JSX.Element {
	const { text, setText } = React.useContext(AlertContext);
	const { light, dark } = useTheme();

	return (
		<div className={cn(classes.wrapper, {
			[classes.light]: light,
			[classes.dark]: dark
		})}>
			<span className={classes.text}>{text}</span>
			<Button onClick={() => setText("")}>закрыть</Button>
		</div >
	);
}

export default Alert;