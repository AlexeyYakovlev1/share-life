import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import AlertContext from "../../context/alert.context";
import useUser from "../../hooks/user/useUser";
import interactionFetch from "../../http/user/interaction.http";
import { IPerson } from "../../models/person.models";
import classes from "./Interaction.module.sass";
import User from "./User";

function Interaction(): JSX.Element {
	const [followersUsr, setFollowersUsr] = React.useState<Array<IPerson>>([]);
	const [followingUsr, setFollowingUsr] = React.useState<Array<IPerson>>([]);
	const { id: pageUserId } = useParams();
	const { user: pageUser } = useUser(pageUserId, pageUserId, [pageUserId]);
	const [searchParams, setSearchParams] = useSearchParams();
	const queryFollowers = searchParams.get("followers") === "y";
	const queryFollowing = searchParams.get("following") === "y";

	const { setText } = React.useContext(AlertContext);

	React.useEffect(() => {
		if (pageUser.id === -1) return;

		interactionFetch(pageUser.id)
			.then((data) => {
				const { success, followers, following, message, error } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				setFollowersUsr(followers || []);
				setFollowingUsr(following || []);
			});
	}, [pageUser]);

	if (queryFollowers && !followersUsr.length) {
		return (
			<MainLayout>
				<h1 className={classes.title}>На этого пользователя еще никто не подписался</h1>
			</MainLayout>
		);
	}

	if (queryFollowing && !followingUsr.length) {
		return (
			<MainLayout>
				<h1 className={classes.title}>
					Этот пользователь еще ни на кого не подписан
				</h1>
			</MainLayout>
		);
	}

	return (
		<MainLayout>
			<ul className={classes.list}>
				{
					queryFollowers &&
					followersUsr.map((follower: IPerson) => (
						<User key={follower.id} user={follower} />
					))
				}
				{
					queryFollowing &&
					followingUsr.map((usr: IPerson) => (
						<User key={usr.id} user={usr} />
					))
				}
			</ul>
		</MainLayout>
	);
}

export default Interaction;