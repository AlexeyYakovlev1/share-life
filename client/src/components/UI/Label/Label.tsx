import classes from "./Label.module.sass";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import cn from "classnames";
import useTheme from "../../../hooks/useTheme";

interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
	form?: string;
	htmlFor?: string;
	htmlfor?: string;
}

interface IInputProps extends DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {
	children: React.ReactNode;
}

function Label({ className, children, ...props }: IInputProps) {
	const { light, dark } = useTheme();

	return (
		<label
			className={cn(classes.label, className, {
				[classes.light]: light,
				[classes.dark]: dark
			})}
			{...props}
		>
			{children}
		</label>
	);
}

export default Label;