import HomePost from "../../components/HomePost/HomePost";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import { IPost } from "../../models/post.models";
import classes from "./Home.module.sass";

function Home(): JSX.Element {
	const posts: Array<IPost> = [
		{
			id: 3,
			ownerId: 1,
			photos: ["https://cdn2.unrealengine.com/nw-m21-bard-1920x1080-3c7e59ea31ec.jpg", "https://cdn.akamai.steamstatic.com/steam/apps/109600/ss_95fa23b07c9bca7ba1cf6941cf169c3df822b6bd.1920x1080.jpg?t=1655927857", "https://cdn.cloudflare.steamstatic.com/steam/apps/109600/ss_0e639f7e5af0ff5219efebd0110af7afe0799820.1920x1080.jpg?t=1655927857"],
			description: "Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дубликации `Здесь ваш текст.. Здесь ваш текст.. Здесь ваш текст..` Многие программы электронной вёрстки и редакторы HTML используют Lorem Ipsum в качестве текста по умолчанию, так что поиск по ключевым словам `lorem ipsum` сразу показывает, как много веб-страниц всё ещё дожидаются своего настоящего рождения. За прошедшие годы текст Lorem Ipsum получил много версий. Некоторые версии появились по ошибке, некоторые - намеренно (например, юмористические варианты).",
			usersLikesIds: [32, 20],
			usersCommentsIds: [1, 2, 4, 5]
		}
	];

	return (
		<MainLayout>
			<div className={classes.wrapper}>
				<ul className={classes.list}>
					{posts.map((post: IPost) => (
						<HomePost key={post.id} info={post} />
					))}
				</ul>
			</div>
		</MainLayout>
	);
}

export default Home;