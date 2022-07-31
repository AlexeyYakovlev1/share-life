import { Link, useLocation } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import OpenPost from "../../components/OpenPost/OpenPost";
import Post from "../../components/Post/Post";
import Button from "../../components/UI/Button/Button";
import { IPost } from "../../models/post.models";
import classes from "./Profile.module.sass";

function Profile(): JSX.Element {
	const currentUser = true;
	const posts: Array<IPost> = [
		{
			id: 3,
			ownerId: 1,
			photos: ["https://cdn.akamai.steamstatic.com/steam/apps/109600/ss_f7c2a3639d782aec69c6d8d075177de7fe291441.1920x1080.jpg?t=1655927857", "https://cdn2.unrealengine.com/nw-m21-bard-1920x1080-3c7e59ea31ec.jpg", "https://cdn.akamai.steamstatic.com/steam/apps/109600/ss_95fa23b07c9bca7ba1cf6941cf169c3df822b6bd.1920x1080.jpg?t=1655927857", "https://cdn.cloudflare.steamstatic.com/steam/apps/109600/ss_0e639f7e5af0ff5219efebd0110af7afe0799820.1920x1080.jpg?t=1655927857"],
			description: "New post from neverwinter",
			usersLikesIds: [2, 4, 1, 59, 32, 20],
			usersCommentsIds: [2, 4, 1]
		},
		{
			id: 4,
			ownerId: 1,
			photos: ["https://cdn2.unrealengine.com/nw-m21-bard-1920x1080-3c7e59ea31ec.jpg", "https://cdn.akamai.steamstatic.com/steam/apps/109600/ss_95fa23b07c9bca7ba1cf6941cf169c3df822b6bd.1920x1080.jpg?t=1655927857", "https://cdn.cloudflare.steamstatic.com/steam/apps/109600/ss_0e639f7e5af0ff5219efebd0110af7afe0799820.1920x1080.jpg?t=1655927857"],
			description: "New post from neverwinter",
			usersLikesIds: [32, 20],
			usersCommentsIds: [1]
		},
		{
			id: 5,
			ownerId: 1,
			photos: ["https://cdn.akamai.steamstatic.com/steam/apps/109600/ss_95fa23b07c9bca7ba1cf6941cf169c3df822b6bd.1920x1080.jpg?t=1655927857", "https://cdn.cloudflare.steamstatic.com/steam/apps/109600/ss_0e639f7e5af0ff5219efebd0110af7afe0799820.1920x1080.jpg?t=1655927857"],
			description: "New post from neverwinter",
			usersLikesIds: [20],
			usersCommentsIds: []
		}
	];
	const search = useLocation().search;
	const query = new URLSearchParams(search);
	const queryPostId = query.get("post_id");
	const queryPostOpen = query.get("watch");

	return (
		<MainLayout>
			{(queryPostOpen && queryPostId) && <OpenPost postId={queryPostId} />}
			<div className={classes.wrapper}>
				<div className={classes.top}>
					<img
						className={classes.avatar}
						src="https://image.api.playstation.com/cdn/EP1965/CUSA05528_00/pImhj205rhCZ3oHbfkKZzvvFL2S3IyL7.png?w=960&h=960"
						alt="avatar"
					/>
					<div className={classes.info}>
						<div className={classes.infoTop}>
							<span className={classes.name}>quod_42</span>
							{!currentUser ? <Button>Following</Button> : <Button>Settings</Button>}
						</div>
						<div className={classes.infoNums}>
							<ul className={classes.infoNumsList}>
								<li className={classes.sinfoNumsItem}>
									<span>
										<Link to="/"><strong>12</strong> post</Link>
									</span>
								</li>
								<li className={classes.sinfoNumsItem}>
									<span>
										<Link to="/"><strong>577</strong> followers</Link>
									</span>
								</li>
								<li className={classes.sinfoNumsItem}>
									<span>
										<Link to="/"><strong>65</strong> following</Link>
									</span>
								</li>
							</ul>
						</div>
						<div className={classes.infoDescription}>
							<p className={classes.infoDescriptionText}>
								Alexey Yakovlev. Front-end developer
							</p>
						</div>
					</div>
				</div>
				<div className={classes.content}>
					<ul className={classes.contentList}>
						{posts.length ? posts.map((post: IPost) => {
							return (
								<Post
									key={post.id}
									photos={post.photos}
									comments={post.usersCommentsIds.length}
									likes={post.usersLikesIds.length}
								/>
							);
						}) : <span>No posts...</span>}
					</ul>
				</div>
			</div>
		</MainLayout>
	);
}

export default Profile;