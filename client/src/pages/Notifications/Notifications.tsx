import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import classes from "./Notifications.module.sass";
import useAccessUser from "../../hooks/useAccessUser";
import { IState } from "../../models/redux.models";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Notifications() {
	const user = useSelector((state: IState) => state.person.info);

	useAccessUser([user], user.id);

	return (
		<MainLayout>
			<article className={classes.wrapper}>
				<h2 className={classes.title}>Уведомления {user.user_name}</h2>
				<ul className={classes.list}>
					<li className={classes.item}>
						<img
							className={classes.itemAvatar}
							src={"https://pbs.twimg.com/media/DiHYZjOVAAA95Yc.jpg"}
							alt="avatar"
						/>
						<div className={classes.itemDescription}>
							<p className={classes.itemDescriptionText}>
								<Link to="/profile/3">alexa</Link>
								&nbsp;оценил(а) ваш пост&nbsp;
								<Link to="/post/">#30</Link>
							</p>
							<span className={classes.itemDescriptionDate}>27.10.2022</span>
						</div>
					</li>
					<li className={classes.item}>
						<img
							className={classes.itemAvatar}
							src={"https://pbs.twimg.com/media/DiHYZjOVAAA95Yc.jpg"}
							alt="avatar"
						/>
						<div className={classes.itemDescription}>
							<p className={classes.itemDescriptionText}>
								<Link to="/profile/3">alexa</Link>
								&nbsp;оценил(а) ваш пост&nbsp;
								<Link to="/post/">#30</Link>
							</p>
							<span className={classes.itemDescriptionDate}>27.10.2022</span>
						</div>
					</li>
					<li className={classes.item}>
						<img
							className={classes.itemAvatar}
							src={"https://pbs.twimg.com/media/DiHYZjOVAAA95Yc.jpg"}
							alt="avatar"
						/>
						<div className={classes.itemDescription}>
							<p className={classes.itemDescriptionText}>
								<Link to="/profile/3">alexa</Link>
								&nbsp;оценил(а) ваш пост&nbsp;
								<Link to="/post/">#30</Link>
							</p>
							<span className={classes.itemDescriptionDate}>27.10.2022</span>
						</div>
					</li>

				</ul>
			</article>
		</MainLayout>
	);
}

export default Notifications;