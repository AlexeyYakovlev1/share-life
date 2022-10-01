import classes from "./Textarea.module.sass";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import cn from "classnames";
import useTheme from "../../../hooks/useTheme";

interface IInputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> { }

function Textarea({ className, ...props }: IInputProps) {
	const { light, dark } = useTheme();

	return (
		<textarea
			className={cn(classes.textarea, className, {
				[classes.light]: light,
				[classes.dark]: dark
			})}
			{...props}
		/>
	);
}

export default Textarea;