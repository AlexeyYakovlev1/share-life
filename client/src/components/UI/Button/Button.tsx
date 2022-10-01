import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import cn from "classnames";
import classes from "./Button.module.sass";
import useTheme from "../../../hooks/useTheme";

interface IButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	children: React.ReactNode;
}

function Button({ className, children, ...props }: IButtonProps) {
	const { light, dark } = useTheme();

	return (
		<button
			className={cn(classes.button, className, {
				[classes.light]: light,
				[classes.dark]: dark
			})}
			{...props}
		>
			{children}
		</button>
	);
}

export default Button;