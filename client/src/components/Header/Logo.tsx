import { DetailedHTMLProps, HTMLAttributes } from "react";
import { Link } from "react-router-dom";
import classes from "./Header.module.sass";
import cn from "classnames";

interface ILogoProps extends DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> { }

function Logo({ className, ...props }: ILogoProps) {
	return (
		<h1
			className={cn(classes.logo, className)}
			{...props}
		>
			<Link to="/">Share Life</Link>
		</h1>
	);
}

export default Logo;