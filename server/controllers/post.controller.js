const db = require("../db");
const toBase64 = require("../utils/toBase64.util");

const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const { PROJECT_ROOT } = process.env;

class PostController {
	create(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}

		const { id } = req.user;

		const queryForFindPerson = `SELECT email FROM person WHERE id = $1`;
		const { description, location, photos } = req.body;

		if (!photos.length) {
			return res.status(400).json({ success: false, message: "Upload some photos" });
		}

		new Promise((resolve) => resolve(db.query(queryForFindPerson, [id])))
			.then((findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) return Promise.reject("Owner is not found");

				const queryForCreatePost = `INSERT INTO post(description,location,owner_id,photos) VALUES($1,$2,$3,$4) RETURNING *`;
				const newPost = db.query(queryForCreatePost, [description, location, id, photos]);

				return Promise.resolve(newPost);
			})
			.then((post) => {
				// convert photos to base64
				const photos = [];

				for (let i = 0; i < post.rows[0].photos.length; i++) {
					const photo = post.rows[0].photos[i];
					const filePath = path.relative(PROJECT_ROOT, `./templates/post/${photo}`);
					const obj = {
						base64: toBase64(filePath, true),
						filename: photo
					};

					photos.push(obj);
				}

				res.status(201).json({ success: true, message: "Post has been created", post: { ...post.rows[0], photos } });
			})
			.catch((error) => res.status(400).json({ success: false, error, message: error.message }));
	}

	remove(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		const { id: idPost } = req.params;
		const { id: idCurrentUser } = req.user;

		const queryForFindPerson = `SELECT email FROM person WHERE id = $1`;

		new Promise((resolve) => resolve(db.query(queryForFindPerson, [idCurrentUser])))
			.then((findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) return Promise.reject("Owner is not found");

				const queryForFindPost = `SELECT owner_id, photos FROM post WHERE id = $1`;
				const findPost = db.query(queryForFindPost, [idPost]);

				return Promise.resolve(findPost);
			})
			.then((findPost) => {
				if (!findPost.rows || !findPost.rows[0]) return Promise.reject("Post is not found");
				if (+findPost.rows[0].owner_id !== +idCurrentUser) return Promise.reject("Access closed");

				// remove photos
				if (findPost.rows[0].photos && findPost.rows[0].photos.length) {
					for (let i = 0; i < findPost.rows[0].photos.length; i++) {
						const photo = findPost.rows[0].photos[i];
						const postPhotoInFolder = path.relative(PROJECT_ROOT, `./templates/post/${photo}`)

						if (fs.existsSync(postPhotoInFolder)) {
							fs.unlink(postPhotoInFolder, (err) => {
								if (err) {
									return res.status(400).json({ succces: false, message: err.message, err });
								}
							})
						}
					}
				}

				// first delete comments then delete post
				const queryForDeleteComments = `DELETE FROM comment WHERE post_id = $1`;
				return Promise.resolve(db.query(queryForDeleteComments, [idPost]));
			})
			.then(() => {
				const queryForDeletePost = `DELETE FROM post WHERE id = $1`;
				return Promise.resolve(db.query(queryForDeletePost, [idPost]));
			})
			.then(() => res.status(200).json({ success: true, message: "Post has been removed" }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	getAllByUserId(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		const { id } = req.params;
		const queryForFindPerson = `SELECT email FROM person WHERE id = $1`;

		new Promise((resolve) => resolve(db.query(queryForFindPerson, [id])))
			.then((findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) return Promise.reject("User is not found");
				const queryForFindPosts = `SELECT * FROM post WHERE owner_id = $1`;
				const posts = db.query(queryForFindPosts, [id]);

				return Promise.resolve(posts);
			})
			.then((posts) => {
				// convert photos posts to base64
				const newPosts = [];

				for (let i = 0; i < posts.rows.length; i++) {
					const post = posts.rows[i];
					const newPhotos = [];

					for (let j = 0; j < post.photos.length; j++) {
						const photo = post.photos[j];
						const filePath = path.relative(PROJECT_ROOT, `./templates/post/${photo}`);
						const newPhoto = {
							base64: toBase64(filePath, true),
							filename: photo
						};

						if (newPhoto) newPhotos.push(newPhoto);
					}

					const obj = { ...post, photos: newPhotos };
					newPosts.push(obj);
				}

				return res.status(200).json({ success: true, posts: newPosts });
			})
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	getAll(req, res) {
		const queryForFindPosts = `SELECT * FROM post`;

		new Promise((resolve) => resolve(db.query(queryForFindPosts)))
			.then((posts) => {
				let newPosts = [];

				// convert photos to base64
				for (let i = 0; i < posts.rows.length; i++) {
					const post = posts.rows[i];
					let newPhotos = [];

					for (let j = 0; j < post.photos.length; j++) {
						const photo = post.photos[j];
						const filePath = path.relative(PROJECT_ROOT, `./templates/post/${photo}`);
						const photoInBase64 = toBase64(filePath, true);
						const obj = {
							base64: photoInBase64,
							filename: photo
						};

						if (photoInBase64) newPhotos.push(obj);
					}

					newPosts.push({ ...post, photos: newPhotos });
				};

				return res.status(200).json({ success: true, posts: newPosts });
			})
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	getOne(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		const { id } = req.params;
		const queryForFindPost = `SELECT * FROM post WHERE id = $1`;

		new Promise((resolve) => resolve(db.query(queryForFindPost, [id])))
			.then((findPost) => {
				if (!findPost.rows || !findPost.rows[0]) return Promise.reject("Post is not found");

				const newPhotos = [];

				for (let i = 0; i < findPost.rows[0].photos.length; i++) {
					const photo = findPost.rows[0].photos[i];
					const filePath = path.relative(PROJECT_ROOT, `./templates/post/${photo}`);
					const newPhoto = {
						base64: toBase64(filePath, true),
						filename: photo
					};

					if (newPhoto) newPhotos.push(newPhoto);
				}

				const newPost = { ...findPost.rows[0], photos: newPhotos };

				return res.status(200).json({ success: true, post: newPost });
			})
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	update(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}

		const { id: idPost } = req.params;
		const { id: idCurrentUser } = req.user;
		const { description, location, photos } = req.body;

		const queryForFindPerson = `SELECT email FROM person WHERE id = $1`;
		let oldPhotos = [];

		new Promise((resolve) => resolve(db.query(queryForFindPerson, [idCurrentUser])))
			.then((findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) return Promise.reject("User is not found");

				const queryForFindPost = `SELECT owner_id,photos FROM post WHERE id = $1`;
				const findPost = db.query(queryForFindPost, [idPost]);

				return Promise.resolve(findPost);
			})
			.then((findPost) => {
				if (!findPost.rows || !findPost.rows[0]) return Promise.reject("Post is not found");
				if (+idCurrentUser !== findPost.rows[0].owner_id) return Promise.reject("Access closed");

				// save old photos. then delete they
				oldPhotos = findPost.rows[0].photos;

				const queryForUpdatePost = `UPDATE post SET description=$1, location=$2, photos=$3 WHERE id=$4 RETURNING *`;
				const updatePost = db.query(queryForUpdatePost, [description, location, photos, idPost]);

				return Promise.resolve(updatePost);
			})
			.then((updatePost) => {
				// remove old photos
				oldPhotos.forEach(photo => {
					if (!updatePost.rows[0].photos.includes(photo)) {
						const filePath = path.relative(PROJECT_ROOT, `./templates/post/${photo}`);
						fs.unlink(filePath, (err) => {
							if (err) return Promise.reject(err);
						});
					}
				});

				return res.status(200).json({ success: true, message: "Post has been updated", post: updatePost.rows[0] });
			})
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	// ставим лайк
	like(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(404).json({ success: false, message: "Params must exist" });
		}

		const { id: userId } = req.user;
		const { id: postId } = req.params;

		const queryForFindPost = `SELECT person_id_likes FROM post WHERE id = $1`;
		const findPost = db.query(queryForFindPost, [postId]);

		new Promise((resolve) => resolve(findPost))
			.then((findPost) => {
				if (!findPost.rows || !findPost.rows[0]) return Promise.reject("Post is not found");

				const queryForViewIdLikes = `SELECT id, person_id_likes FROM post WHERE $1 = ANY(person_id_likes)`;
				const likePost = db.query(queryForViewIdLikes, [userId]);

				return Promise.resolve(likePost);
			})
			.then((likePost) => {
				const likeAsBool = Boolean(likePost.rows.length && likePost.rows[0].id);
				const io = req.app.get("socketio");

				io.on("connection", (socket) => io.emit("likePost", likeAsBool));

				// если пользователь не ставил лайк (раньше), то вносим его в массив
				if (!likeAsBool) {
					const queryForAddIdToLikes = `
						UPDATE post SET person_id_likes = ARRAY_APPEND(person_id_likes, $1) WHERE id = $2 RETURNING person_id_likes
					`;
					return Promise.resolve(db.query(queryForAddIdToLikes, [userId, postId]));
				}

				// если пользователь ставил лайк (раньше), то удаляем его из массива
				const queryForRemoveIdFromLikes = `
					UPDATE post SET person_id_likes = ARRAY_REMOVE(person_id_likes, $1) WHERE id = $2 RETURNING person_id_likes
				`;
				return Promise.resolve(db.query(queryForRemoveIdFromLikes, [userId, postId]));
			})
			.then((result) => {
				return res.status(200).json({ success: true, likesNum: result.rows[0].person_id_likes.length });
			})
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	// проверка переданного id пользователя на поставленный лайк на определенном посте
	putedLike(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(404).json({ success: false, message: "Params must exist" });
		}

		const { id: postId } = req.params;
		const { id: userId } = req.user;

		const queryForCheckIdInLikes = `SELECT id FROM post WHERE $1 = ANY(person_id_likes)`;
		const findPost = db.query(queryForCheckIdInLikes, [userId]);

		new Promise((resolve) => resolve(findPost))
			.then((findPost) => {
				if (!findPost.rows || !findPost.rows[0]) return Promise.resolve(false);
				return Promise.resolve(+findPost.rows[0].id === +postId);
			})
			.then((result) => res.status(200).json({ success: true, result }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}
}

module.exports = new PostController();