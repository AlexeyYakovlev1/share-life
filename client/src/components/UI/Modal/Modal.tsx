import classes from "./Modal.module.sass";
import cn from "classnames";
import { ReactComponent as CloseIcon } from "../../../assets/images/close.svg";
import useTheme from "../../../hooks/useTheme";

interface IModal {
	children: React.ReactNode;
	setClose: React.Dispatch<React.SetStateAction<boolean>>;
}

function Modal({ setClose, children }: IModal) {
	const { light, dark } = useTheme();

	return (
		<div
			className={cn(classes.wrapper, {
				[classes.wrapperHide]: close
			})}
			onClick={() => setClose(true)}
		>
			<div
				className={cn(classes.content, {
					[classes.light]: light,
					[classes.dark]: dark
				})}
				onClick={(event) => event.stopPropagation()}
			>
				<header className={classes.header}>
					<CloseIcon onClick={() => setClose(true)} />
				</header>
				{children}
			</div>
		</div>
	);
}

export default Modal;