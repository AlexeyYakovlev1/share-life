import { DetailedHTMLProps, HTMLAttributes } from "react";
import { Link } from "react-router-dom";
import classes from "./Header.module.sass";
import cn from "classnames";
import useTheme from "../../hooks/useTheme";

interface ILogoProps extends DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> { }

function Logo({ className, ...props }: ILogoProps) {
	const { light, dark } = useTheme();

	return (
		<h1
			className={cn(classes.logo, className, {
				[classes.light]: light,
				[classes.dark]: dark
			})}
			{...props}
		>
			<Link to="/">Share Life</Link>
		</h1>
	);
}

export default Logo;