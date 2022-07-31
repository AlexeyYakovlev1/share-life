import { IPost } from "../../models/post.models";
import classes from "./OpenPost.module.sass";
import { ReactComponent as ThreeDotsIcon } from "../../assets/images/three_dots.svg";
import { useLocation, useNavigate } from "react-router-dom";

function OpenPost({ postId }: { postId: string }): JSX.Element {
	const currentPost = {
		id: 4,
		ownerId: 1,
		photos: ["https://cdn2.unrealengine.com/nw-m21-bard-1920x1080-3c7e59ea31ec.jpg", "https://cdn.akamai.steamstatic.com/steam/apps/109600/ss_95fa23b07c9bca7ba1cf6941cf169c3df822b6bd.1920x1080.jpg?t=1655927857", "https://cdn.cloudflare.steamstatic.com/steam/apps/109600/ss_0e639f7e5af0ff5219efebd0110af7afe0799820.1920x1080.jpg?t=1655927857"],
		description: "New post from neverwinter",
		usersLikesIds: [32, 20],
		usersCommentsIds: [1]
	};
	const userPost = {
		id: 2,
		userName: "quod_42",
		fullName: "Alexey Yakovlev",
		email: "alex@gmail.com",
		avatar: "https://image.api.playstation.com/cdn/EP1965/CUSA05528_00/pImhj205rhCZ3oHbfkKZzvvFL2S3IyL7.png?w=960&h=960"
	};
	const isTrue = true;
	const location = useLocation();
	const query = Boolean(new URLSearchParams(location.search).get("watch"));
	const navigate = useNavigate();

	function closePost() {
		const params = new URLSearchParams({ watch: `${!query}` });
		navigate({ pathname: location.pathname, search: params.toString() });
	}

	return (
		<div className={classes.wrapper} onClick={closePost}>
			<div className={classes.content} onClick={event => event.stopPropagation()}>
				<div className={classes.left}>
					<div
						className={classes.photo}
						style={{ backgroundImage: `url(${currentPost.photos[0]}` }}
					></div>
				</div>
				<div className={classes.info}>
					<header className={classes.infoHeader}>
						<div className={classes.infoHeaderDescription}>
							<img
								className={classes.avatar}
								src={userPost.avatar}
								alt={userPost.userName}
							/>
							<div className={classes.infoUser}>
								<div>
									<span className={classes.infoUserName}>{userPost.userName} &#x2022;</span>
									<span className={classes.infoUserFollowing}>&nbsp;{isTrue ? "Following" : "Not followed"}</span>
								</div>
								<span className={classes.location}>Coupa Cafe - Ramona</span>
							</div>
						</div>
						<div>
							<button className={classes.infoBtnSettings}>
								<ThreeDotsIcon />
							</button>
						</div>
					</header>
					<div className={classes.infoBody}>
						<div className={classes.infoComments}>
							<h3>Comments</h3>
						</div>
						<div className={classes.infoActions}>
							<h3>Actions</h3>
						</div>
					</div>
				</div>
			</div>
		</div >
	);
}

export default OpenPost;