import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import classes from "./AddPost.module.sass";
import cn from "classnames";
import { ReactComponent as ArrowLeftIcon } from "../../assets/images/arrow-left.svg";
import { useSlider } from "../../hooks/useSlider";
import React from "react";
import { IState } from "../../models/redux.models";
import { useSelector } from "react-redux";
import LoaderContext from "../../context/loader.context";
import AlertContext from "../../context/alert.context";
import readerImages, { IPhoto } from "../../utils/readerImages.util";
import uploadImages from "../../utils/uploadImages.util";
import Cookies from "js-cookie";
import axios from "axios";

const { REACT_APP_API_URL } = process.env;

function AddPost(): JSX.Element {
	const { avatar, user_name } = useSelector((state: IState) => state.person.info);

	const [photos, setPhotos] = React.useState<Array<IPhoto>>([]);
	const [selectedImages, setSelectedImages] = React.useState<any>([]);
	const [post, setPost] = React.useState({
		description: "",
		location: "",
		photos: [""]
	});

	const { setCount, sliderWrapperRef, count, widthSlider } = useSlider({ list: photos });
	const uploadRef = React.useRef<HTMLInputElement | null>(null);

	const { setLoad } = React.useContext(LoaderContext);
	const { setText } = React.useContext(AlertContext);

	React.useEffect(() => {
		readerImages(selectedImages, setLoad, setPhotos, setText);
	}, [selectedImages]);

	function sharePost(event: React.ChangeEvent<HTMLFormElement>) {
		event.preventDefault();

		if (selectedImages.length) {
			const formData = new FormData();
			formData.append("photos", selectedImages);

			// upload photos
			axios({
				method: "POST",
				url: `${REACT_APP_API_URL}/upload/photos`,
				headers: {
					Authorization: `Bearer ${Cookies.get("token")}`,
					"Accept-Type": "application/json"
				},
				data: formData
			})
				.then((response) => console.log(response))
				.catch((error) => console.log(error.response.data));
		}
	}

	return (
		<MainLayout>
			<div className={classes.wrapper}>
				<header className={classes.header}>
					<h3 className={classes.title}>Create new post</h3>
				</header>
				<div className={classes.content}>
					<div className={classes.slider} ref={sliderWrapperRef}>
						{photos.length ?
							<React.Fragment>
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
							</React.Fragment>
							: false
						}
						<ul
							className={cn(classes.sliderList, {
								[classes.sliderListEmpty]: !photos.length
							})}
							style={{ width: photos.length ? widthSlider * photos.length + "px" : "100%" }}
						>
							{photos.length ? photos.map(photo => (
								<li
									key={photo.id}
									style={{
										width: `${widthSlider}px`,
										height: "500px",
										transform: `translate(-${count * widthSlider}px)`,
										backgroundImage: `url(${photo.img})`
									}}
								></li>
							)) : <span className={classes.sliderNoPhotos}>Add photos in this post</span>}
						</ul>
					</div>
					<div className={classes.right}>
						<div className={classes.rightHeader}>
							<div>
								<input
									ref={uploadRef}
									type="file"
									style={{ display: "none" }}
									accept="image/*"
									multiple
									required
									onChange={(event) => uploadImages(event, setLoad, setSelectedImages, setText)}
								/>
								<Button
									onClick={() => uploadRef.current?.click()}
									className={classes.rightHeaderUploadBtn}
								>
									Upload photos
								</Button>
							</div>
							<div className={classes.rightHeaderUser}>
								<img
									className={classes.rightAvatar}
									src={avatar}
									alt={user_name}
								/>
								<span className={classes.rightUserName}>{user_name}</span>
							</div>
						</div>
						<form
							encType="multipart/form-data"
							className={classes.rightDown}
							onSubmit={sharePost}
						>
							<textarea
								className={classes.rightCaption}
								placeholder="Write a caption..."
								value={post.description}
								onChange={(event) => setPost({ ...post, description: event.target.value })}
							/>
							<Input
								type="text"
								placeholder="Add location"
								value={post.location}
								onChange={(event) => setPost({ ...post, location: event.target.value })}
							/>
							<Button>Share</Button>
						</form>
					</div>
				</div>
			</div>
		</MainLayout>
	);
}

export default AddPost;