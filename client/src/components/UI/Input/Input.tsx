import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import cn from "classnames";
import classes from "./Input.module.sass";

interface IInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> { }

function Input({ className, ...props }: IInputProps) {
	return (
		<input
			className={cn(classes.input, className)}
			{...props}
		/>
	);
}

export default Input;