import React from "react";
import classes from "./Alert.module.sass";
import AlertContext from "../../../context/alert.context";
import Button from "../Button/Button";

function Alert(): JSX.Element {
	const { text, setText } = React.useContext(AlertContext);

	return (
		<div className={classes.wrapper}>
			<span className={classes.text}>{text}</span>
			<Button onClick={() => setText("")}>close</Button>
		</div >
	);
}

export default Alert;