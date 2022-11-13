import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import { IPostPhoto } from "../../models/post.models";
import classes from "./ChangePost.module.sass";
import React from "react";
import AlertContext from "../../context/alert.context";
import cn from "classnames";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import uploadImages from "../../utils/uploadImages.util";
import readerImages from "../../utils/readerImages.util";
import updatePost, { IUpdateBody } from "../../http/posts/updatePost.http";
import uploadPhotos from "../../http/files/uploadPhotos.http";
import useAccessUser from "../../hooks/access/useAccessUser";
import Textarea from "../../components/UI/Textarea/Textarea";
import useTheme from "../../hooks/useTheme";
import usePost from "../../hooks/post/usePost";

function ChangePost(): JSX.Element {
	const { light, dark } = useTheme();
	const { id: postId } = useParams();
	const { setText } = React.useContext(AlertContext);
	const navigate = useNavigate();

	const { post } = usePost(postId, postId, [postId]);

	const uploadRef = React.useRef<HTMLInputElement | null>(null);
	const [selectedImages, setSelectedImages] = React.useState<Array<any>>([]);
	const [photos, setPhotos] = React.useState<Array<IPostPhoto>>(post.photos);
	const [changePost, setChangePost] = React.useState<IUpdateBody>({
		description: post.description || "", location: post.location || "",
		photos: photos.map(photo => photo.filename)
	});
	const [imagesUpload, setImagesUpload] = React.useState<boolean>(false);

	const disabled = (changePost.description.length >= 2200) || (changePost.location.length < 3) || (changePost.location.length >= 20) || !photos.length;
	useAccessUser([post], post.owner_id);

	React.useEffect(() => {
		setChangePost({
			description: post.description || "",
			location: post.location,
			photos: photos.map(photo => photo.filename)
		});

		setPhotos(post.photos);
	}, [post]);

	React.useEffect(() => {
		setChangePost({ ...changePost, photos: photos.map((p) => p.filename) });
	}, [photos]);

	React.useEffect(() => {
		readerImages(selectedImages, setPhotos, setText, true);
	}, [selectedImages]);

	// submit post
	React.useEffect(() => {
		if (!imagesUpload) return;

		updatePost(post.id, changePost)
			.then((data) => {
				const { success, message, error } = data;
				setText(message || error);
				if (!success) return;
				navigate(`/profile/${post.owner_id}`);
			});
	}, [imagesUpload]);

	function uploadPhotosSubmt(event: any) {
		event.preventDefault();

		if (selectedImages.length) {
			const formData = new FormData();
			selectedImages.map((image) => formData.append("photos", image));

			uploadPhotos(formData)
				.then((data) => {
					const { success, message, error, fileNames } = data;

					if (!success) {
						setText(message || error);
						return;
					}

					setChangePost({ ...changePost, photos: fileNames });
					setImagesUpload(success && fileNames.length);
				});
		} else {
			setImagesUpload(true);
		}
	}

	function deletePhoto(filename: string) {
		const newPhotos = photos.filter((p: IPostPhoto) => p.filename !== filename);
		setPhotos(newPhotos);
	}

	return (
		<MainLayout>
			<article className={cn(classes.wrapper, {
				[classes.light]: light,
				[classes.dark]: dark
			})}>
				<div className={classes.content}>
					<div className={cn(classes.contentChange, classes.photos)}>
						<h2 className={classes.contentChangeTitle}>Фотографии</h2>
						<ul className={classes.photosList}>
							{photos.length ? photos.map((photo: IPostPhoto, index: number) => (
								<li
									key={`${photo.filename}_${index + 1}`}
									style={{ backgroundImage: `url(${photo.base64})` }}
									className={classes.photosItem}
								>
									<Button
										onClick={() => deletePhoto(photo.filename)}
										className={classes.photosItemDelete}
									>
										Удалить
									</Button>
								</li>
							)) : <span className={classes.photosEmpty}>Нужно хотя-бы одно фото</span>}
						</ul>
						<Button
							onClick={() => uploadRef.current?.click()}
							className={classes.photosAdd}
						>
							Загрузить другие фотографии
						</Button>
						<input
							onChange={(event) => uploadImages(event, setSelectedImages, setText)}
							accept="image/*"
							multiple
							required
							ref={uploadRef}
							type="file"
							hidden
							name="photos"
						/>
					</div>
					<div className={cn(classes.contentChange, classes.description)}>
						<h2 className={classes.contentChangeTitle}>Описание</h2>
						<Textarea
							value={changePost.description}
							className={classes.captionInput}
							onChange={(event) => setChangePost({ ...changePost, description: event.target.value })}
						/>
					</div>
					<div className={cn(classes.contentChange, classes.location)}>
						<h2 className={classes.contentChangeTitle}>Место</h2>
						<Input
							type="text"
							className={classes.locationInput}
							value={changePost.location}
							onChange={(event) => setChangePost({ ...changePost, location: event.target.value })}
						/>
					</div>
				</div>
				<Button
					type="submit"
					onClick={uploadPhotosSubmt}
					className={classes.submit}
					disabled={disabled}
				>
					Готово
				</Button>
			</article>
		</MainLayout>
	);
}

export default ChangePost;