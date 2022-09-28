import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import AlertContext from "../../context/alert.context";
import getOneUser from "../../http/user/getOneUser.http";
import interactionFetch from "../../http/user/interaction.http";
import { IPerson } from "../../models/person.models";
import classes from "./Interaction.module.sass";
import User from "./User";

function Interaction(): JSX.Element {
	const [followersUsr, setFollowersUsr] = React.useState<Array<IPerson>>([]);
	const [followingUsr, setFollowingUsr] = React.useState<Array<IPerson>>([]);
	const [pageUser, setPageUser] = React.useState<IPerson>({
		id: -1,
		full_name: "",
		user_name: "",
		email: "",
		avatar: {
			base64: "",
			filename: ""
		},
		password: "",
		roles: [""],
		description: "",
		followers: [],
		following: []
	});

	const { id: pageUserId } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const queryFollowers = searchParams.get("followers") === "y";
	const queryFollowing = searchParams.get("following") === "y";
	const navigate = useNavigate();

	const { setText } = React.useContext(AlertContext);

	React.useEffect(() => {
		if (!pageUserId) return;

		getOneUser(+pageUserId)
			.then((data) => {
				const { success, person, message, error } = data;

				if (!success) {
					setText(message || error);
					navigate("/");
					return;
				}

				setPageUser(person);
			});
	}, [pageUserId]);

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
				<h1 className={classes.title}>No one has subscribed to this user yet</h1>
			</MainLayout>
		);
	}

	if (queryFollowing && !followingUsr.length) {
		return (
			<MainLayout>
				<h1 className={classes.title}>This user hasn`t followed anyone yet</h1>
			</MainLayout>
		);
	}

	return (
		<MainLayout>
			{
				queryFollowers &&
				<ul className={classes.list}>
					{followersUsr.map((follower: IPerson) => (
						<User key={follower.id} user={follower} />
					))}
				</ul>
			}
			{
				queryFollowing &&
				<ul className={classes.list}>
					{followingUsr.map((usr: IPerson) => (
						<User key={usr.id} user={usr} />
					))}
				</ul>
			}
		</MainLayout>
	);
}

export default Interaction;