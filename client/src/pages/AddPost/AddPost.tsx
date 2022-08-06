import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import classes from "./AddPost.module.sass";
import cn from "classnames";
import { ReactComponent as ArrowLeftIcon } from "../../assets/images/arrow-left.svg";
import { useSlider } from "../../hooks/useSlider";

function AddPost(): JSX.Element {
	const user = {
		id: 2,
		userName: "quod_42",
		fullName: "Alexey Yakovlev",
		email: "alex@gmail.com",
		avatar: "https://image.api.playstation.com/cdn/EP1965/CUSA05528_00/pImhj205rhCZ3oHbfkKZzvvFL2S3IyL7.png?w=960&h=960"
	};
	const photos = [
		{
			id: 1,
			img: "https://images.ctfassets.net/hrltx12pl8hq/4MFiRr9vFnbWzYoNSPiYXy/fca130dd40da59b06e83ee8d5789a23e/file-converter-shutterstock.jpg"
		},
		{
			id: 2,
			img: "https://cryptocurrency.tech/wp-content/uploads/2022/04/cross-chain-640x336.png"
		},
		{
			id: 3,
			img: "https://cypruspropertygallery.com/image/cache/catalog/service/ghj-640x336.jpg"
		}
	];
	const { setCount, sliderWrapperRef, count, widthSlider } = useSlider({ list: photos });

	return (
		<MainLayout>
			<div className={classes.wrapper}>
				<header className={classes.header}>
					<h3 className={classes.title}>Create new post</h3>
				</header>
				<div className={classes.content}>
					<div className={classes.slider} ref={sliderWrapperRef}>
						<button
							className={cn(classes.sliderBtn, classes.sliderBtnLeft)}
							onClick={() => setCount(count - 1)}
						>
							<ArrowLeftIcon />
						</button>
						<button
							className={cn(classes.sliderBtn, classes.sliderBtnRight)}
							onClick={() => setCount(count + 1)}
						>
							<ArrowLeftIcon />
						</button>
						<ul
							className={classes.sliderList}
							style={{ width: `${widthSlider * photos.length}px` }}
						>
							{photos.map(photo => (
								<li
									key={photo.id}
									style={{
										width: `${widthSlider}px`,
										height: "500px",
										transform: `translate(-${count * widthSlider}px)`,
										backgroundImage: `url(${photo.img})`
									}}
								></li>
							))}
						</ul>
					</div>
					<div className={classes.right}>
						<div className={classes.rightHeader}>
							<img
								className={classes.rightAvatar}
								src={user.avatar}
								alt={user.userName}
							/>
							<span className={classes.rightUserName}>{user.userName}</span>
						</div>
						<textarea
							className={classes.rightCaption}
							placeholder="Write a caption..."
						/>
						<div className={classes.rightDown}>
							<Input
								type="text"
								placeholder="Add location"
							/>
							<Button>Share</Button>
						</div>
					</div>
				</div>
			</div>
		</MainLayout>
	);
}

export default AddPost;