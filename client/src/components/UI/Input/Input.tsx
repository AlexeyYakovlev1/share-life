import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import cn from "classnames";
import classes from "./Input.module.sass";
import useTheme from "../../../hooks/useTheme";

interface IInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> { }

function Input({ className, ...props }: IInputProps) {
	const { light, dark } = useTheme();

	return (
		<input
			className={cn(classes.input, className, {
				[classes.light]: light,
				[classes.dark]: dark
			})}
			{...props}
		/>
	);
}

export default Input;