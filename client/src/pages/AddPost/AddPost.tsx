import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import classes from "./AddPost.module.sass";
import cn from "classnames";
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
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import "swiper/css";

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
					<h3 className={classes.title}>Создать новый пост</h3>
					{errors && <span className={classes.errors}>Ошибка отправки. Проверьте корректность данных</span>}
				</header>
				<div className={classes.content}>
					<div className={classes.slider}>
						<Swiper
							className={classes.bodyPhotosList}
							spaceBetween={50}
							slidesPerView={1}
						>
							{photos.length ? photos.map(photo => {
								return (
									<SwiperSlide
										className={classes.bodyPhotosListItem}
										key={photo.id}
									>
										<img src={photo.img} alt="photo" />
									</SwiperSlide>
								);
							}) : <span className={classes.sliderNoPhotos}>Добавьте фото к этому посту</span>}
						</Swiper>
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
									Загрузить фотографии
								</Button>
							</div>
							<div className={classes.rightHeaderUser}>
								<div
									className={classes.rightAvatar}
									style={{ backgroundImage: `url(${avatar})` }}
								></div>
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
								placeholder="Напишите описание..."
								value={post.description}
								onChange={(event) => setPost({ ...post, description: event.target.value })}
							/>
							<Input
								type="text"
								placeholder="Добавить место"
								value={post.location}
								onChange={(event) => setPost({ ...post, location: event.target.value })}
							/>
							<Button disabled={disabled}>Поделиться</Button>
						</form>
					</div>
				</div>
			</article>
		</MainLayout>
	);
}

export default AddPost;