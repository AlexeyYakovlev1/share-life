import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import classes from "./AddPost.module.sass";
import cn from "classnames";
import { ReactComponent as ArrowLeftIcon } from "../../assets/images/arrow-left.svg";
import { useSlider } from "../../hooks/useSlider";
import React from "react";
import { IState } from "../../models/redux.models";
import { useDispatch, useSelector } from "react-redux";
import AlertContext from "../../context/alert.context";
import readerImages, { IPhoto } from "../../utils/readerImages.util";
import uploadImages from "../../utils/uploadImages.util";
import useAvatar from "../../hooks/useAvatar";
import uploadPhotos from "../../http/files/uploadPhotos.http";
import addPostAsyncAction from "../../redux/actions/async/posts/addPost";
import { useNavigate } from "react-router-dom";
import Textarea from "../../components/UI/Textarea/Textarea";
import useTheme from "../../hooks/useTheme";

function AddPost(): JSX.Element {
	const { light, dark } = useTheme();
	const { avatar: avatarRedux, user_name } = useSelector((state: IState) => state.person.info);
	const dispatch: any = useDispatch();

	const [photos, setPhotos] = React.useState<Array<IPhoto>>([]);
	const [selectedImages, setSelectedImages] = React.useState<any>([]);
	const [post, setPost] = React.useState<any>({
		description: "",
		location: "",
		photos: []
	});
	const [errors, setErrors] = React.useState<boolean>(false);

	const { setCount, sliderWrapperRef, count, widthSlider, sliderOffsetWidth } = useSlider({ list: photos });
	const uploadRef = React.useRef<HTMLInputElement | null>(null);
	const avatar = useAvatar(avatarRedux.base64);
	const navigate = useNavigate();
	const disabled = (post.description.length >= 2200) || ((post.location.length < 3) || (post.location.length >= 20)) || !photos.length;

	const { setText } = React.useContext(AlertContext);

	React.useEffect(() => {
		readerImages(selectedImages, setPhotos, setText);
	}, [selectedImages]);

	// send all data for new post
	React.useEffect(() => {
		if (!post.photos.length) return;
		dispatch(addPostAsyncAction(post, setErrors, setText));
		navigate("/");
	}, [post.photos]);

	// upload photos
	function submitPost(event: React.ChangeEvent<HTMLFormElement>) {
		event.preventDefault();

		if (selectedImages.length) {
			const formData = new FormData();
			selectedImages.map((image: any) => formData.append("photos", image));

			uploadPhotos(formData)
				.then((data) => {
					const { success, message, fileNames } = data;

					if (!success) {
						setText(message);
						return;
					}

					setPost({ ...post, photos: fileNames });
				});
		}
	}

	return (
		<MainLayout>
			<article className={cn(classes.wrapper, {
				[classes.light]: light,
				[classes.dark]: dark
			})}>
				<header className={classes.header}>
					<h3 className={classes.title}>Create new post</h3>
					{errors && <span className={classes.errors}>Submit failed. Check your data</span>}
				</header>
				<div className={classes.content}>
					<div className={classes.slider} ref={sliderWrapperRef}>
						{photos.length > 1 ?
							<React.Fragment>
								<Button
									className={cn(classes.sliderBtn, classes.sliderBtnLeft)}
									onClick={() => setCount(count - 1)}
								>
									<ArrowLeftIcon />
								</Button>
								<Button
									className={cn(classes.sliderBtn, classes.sliderBtnRight)}
									onClick={() => setCount(count + 1)}
								>
									<ArrowLeftIcon />
								</Button>
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
									className={classes.sliderListItem}
									key={photo.id}
									style={{
										width: `${sliderOffsetWidth}px`,
										transform: `translate(-${count * sliderOffsetWidth}px)`,
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
									hidden
									accept="image/*"
									multiple
									required
									onChange={(event) => uploadImages(event, setSelectedImages, setText)}
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
							onSubmit={submitPost}
						>
							<Textarea
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
							<Button disabled={disabled}>Share</Button>
						</form>
					</div>
				</div>
			</article>
		</MainLayout>
	);
}

export default AddPost;