import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../components/Layouts/MainLayout/MainLayout";
import { IPost, IPostPhoto } from "../../models/post.models";
import classes from "./ChangePost.module.sass";
import React from "react";
import getOnePost from "../../http/posts/getOnePost.http";
import AlertContext from "../../context/alert.context";
import cn from "classnames";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import uploadImages from "../../utils/uploadImages.util";
import readerImages from "../../utils/readerImages.util";
import updatePost, { IUpdateBody } from "../../http/posts/updatePost.http";
import uploadPhotos from "../../http/files/uploadPhotos.http";

function ChangePost(): JSX.Element {
	const { id: postId } = useParams();
	const [post, setPost] = React.useState<IPost>({
		id: -1,
		owner_id: -1,
		photos: [],
		description: "",
		location: "",
		date: ""
	});
	const { setText } = React.useContext(AlertContext);
	const uploadRef = React.useRef<HTMLInputElement | null>(null);
	const [selectedImages, setSelectedImages] = React.useState<Array<any>>([]);
	const [photos, setPhotos] = React.useState<Array<IPostPhoto>>(post.photos);
	const [changePost, setChangePost] = React.useState<IUpdateBody>({
		description: post.description || "", location: post.location || "",
		photos: photos.map(photo => photo.filename)
	});
	const navigate = useNavigate();
	const [imagesUpload, setImagesUpload] = React.useState<boolean>(false);
	const disabled = (changePost.description.length >= 2200) || (changePost.location.length < 3) || (changePost.location.length >= 20) || !selectedImages.length;

	React.useEffect(() => {
		if (!postId) return;

		getOnePost(+postId)
			.then((data) => {
				const { success, message, error, post: currentPost } = data;

				if (!success) {
					setText(message || error);
					return;
				}

				setPost(currentPost);
				setChangePost({
					description: currentPost.description,
					location: currentPost.location,
					photos: photos.map(photo => photo.filename)
				});
				setPhotos(currentPost.photos);
			});
	}, [postId]);

	React.useEffect(() => {
		setChangePost({ ...changePost, photos: photos.map((p) => p.filename) });
	}, [photos]);

	React.useEffect(() => {
		readerImages(selectedImages, setPhotos, setText, true);
	}, [selectedImages]);

	// give all data from change post
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

	// upload photos
	function submitHandler(event: any) {
		event.preventDefault();

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
	}

	function deletePhoto(filename: string) {
		const newPhotos = photos.filter((p: IPostPhoto) => p.filename !== filename);
		setPhotos(newPhotos);
	}

	return (
		<MainLayout>
			<div className={classes.wrapper}>
				<div className={classes.content}>
					<div className={cn(classes.contentChange, classes.photos)}>
						<h2 className={classes.contentChangeTitle}>Photos</h2>
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
										Delete
									</Button>
								</li>
							)) : <span className={classes.photosEmpty}>Need at least one photo</span>}
						</ul>
						<Button
							onClick={() => uploadRef.current?.click()}
							className={classes.photosAdd}
						>
							Upload other images
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
						<h2 className={classes.contentChangeTitle}>Caption</h2>
						<textarea
							value={changePost.description}
							className={classes.captionInput}
							onChange={(event) => setChangePost({ ...changePost, description: event.target.value })}
						/>
					</div>
					<div className={cn(classes.contentChange, classes.location)}>
						<h2 className={classes.contentChangeTitle}>Location</h2>
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
					onClick={submitHandler}
					className={classes.submit}
					disabled={disabled}
				>
					Done
				</Button>
			</div>
		</MainLayout>
	);
}

export default ChangePost;