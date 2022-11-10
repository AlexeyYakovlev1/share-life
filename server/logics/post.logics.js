const db = require("../db");
const toBase64 = require("../utils/toBase64.util");

const fs = require("fs");
const path = require("path");

const { PROJECT_ROOT } = process.env;

class PostLogics {
	create({ id, description, location, photos }) {
		const queryForFindPerson = `SELECT email FROM person WHERE id = $1`;
		const findPerson = db.query(queryForFindPerson, [id]);

		return new Promise((resolve) => resolve(findPerson))
			.then((findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) {
					return Promise.reject("Создатель поста не найден");
				}

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

				return { success: true, message: "Пост опубликован", post: { ...post.rows[0], photos } }
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	remove({ idPost, idCurrentUser }) {
		const queryForFindPerson = `SELECT email FROM person WHERE id = $1`;

		return new Promise((resolve) => resolve(db.query(queryForFindPerson, [idCurrentUser])))
			.then((findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) {
					return Promise.reject("Создатель поста не найден");
				}

				const queryForFindPost = `SELECT owner_id, photos FROM post WHERE id = $1`;
				const findPost = db.query(queryForFindPost, [idPost]);

				return Promise.resolve(findPost);
			})
			.then((findPost) => {
				if (!findPost.rows || !findPost.rows[0]) {
					return Promise.reject("Пост не найден");
				}
				if (+findPost.rows[0].owner_id !== +idCurrentUser) {
					return Promise.reject("Доступ закрыт");
				}

				// remove photos
				if (findPost.rows[0].photos && findPost.rows[0].photos.length) {
					for (let i = 0; i < findPost.rows[0].photos.length; i++) {
						const photo = findPost.rows[0].photos[i];
						const postPhotoInFolder = path.relative(PROJECT_ROOT, `./templates/post/${photo}`)

						if (fs.existsSync(postPhotoInFolder)) {
							fs.unlink(postPhotoInFolder, (err) => {
								if (err) {
									return Promise.reject(err.message || err);
								}
							})
						}
					}
				}

				// first delete comments then delete post
				const queryForDeleteComments = `DELETE FROM comment WHERE post_id = $1`;
				const deleteComments = db.query(queryForDeleteComments, [idPost]);

				return Promise.resolve(deleteComments);
			})
			.then(() => {
				const queryForDeletePost = `DELETE FROM post WHERE id = $1`;
				return Promise.resolve(db.query(queryForDeletePost, [idPost]));
			})
			.then(() => {
				return { success: true, message: "Пост удален" };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	getAllByUserId({ id }) {
		const queryForFindPerson = `SELECT email FROM person WHERE id = $1`;
		const findPerson = db.query(queryForFindPerson, [id]);

		return new Promise((resolve) => resolve(findPerson))
			.then((findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) {
					return Promise.reject("Пользователь не найден");
				}

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

				return { success: true, posts: newPosts };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	getAll({ _limit, _page }) {
		const queryForFindPosts = `SELECT * FROM post ORDER BY date DESC LIMIT $1 OFFSET $2`;
		const findPosts = db.query(queryForFindPosts, [_limit, _page]);

		return new Promise((resolve) => resolve(findPosts))
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

				return { success: true, posts: newPosts, totalCount: posts.rows.length };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	getOne({ id }) {
		const queryForFindPost = `SELECT * FROM post WHERE id = $1`;
		const findPost = db.query(queryForFindPost, [id]);

		return new Promise((resolve) => resolve(findPost))
			.then((findPost) => {
				if (!findPost.rows || !findPost.rows[0]) {
					return Promise.reject("Пост не найден");
				}

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

				return { success: true, post: newPost };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	update({ idPost, idCurrentUser, description, location, photos }) {
		const queryForFindPerson = `SELECT email FROM person WHERE id = $1`;
		const findPerson = db.query(queryForFindPerson, [idCurrentUser]);

		let oldPhotos = [];

		return new Promise((resolve) => resolve(findPerson))
			.then((findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) {
					return Promise.reject("Пользователь не найден");
				}

				const queryForFindPost = `SELECT owner_id,photos FROM post WHERE id = $1`;
				const findPost = db.query(queryForFindPost, [idPost]);

				return Promise.resolve(findPost);
			})
			.then((findPost) => {
				if (!findPost.rows || !findPost.rows[0]) {
					return Promise.reject("Пост не найден");
				}
				if (+idCurrentUser !== findPost.rows[0].owner_id) {
					return Promise.reject("Доступ закрыт");
				}

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

				return { success: true, message: "Пост обновлен", post: updatePost.rows[0] };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	like({ userId, postId, io }) {
		const queryForFindPost = `SELECT id, person_id_likes, owner_id FROM post WHERE id = $1`;
		const findPost = db.query(queryForFindPost, [postId]);

		return new Promise((resolve) => resolve(findPost))
			.then((findPost) => {
				if (!findPost.rows || !findPost.rows[0]) {
					return Promise.reject("Пост не найден");
				}

				const likeAsBool = Boolean(
					findPost.rows.length && findPost.rows[0].id &&
					findPost.rows[0].person_id_likes.includes(userId)
				);

				io.on("connection", (socket) => {
					io.emit("likePost", likeAsBool);
				});

				// если пользователь не ставил лайк (раньше), то вносим его в массив
				if (!likeAsBool) {
					const queryForAddIdToLikes = `
						UPDATE post SET person_id_likes = ARRAY_APPEND(person_id_likes, $1) WHERE id = $2 RETURNING person_id_likes
					`;
					const addIdToLikes = db.query(queryForAddIdToLikes, [userId, postId]);

					return Promise.resolve(addIdToLikes);
				}

				// если пользователь ставил лайк (раньше), то удаляем его из массива
				const queryForRemoveIdFromLikes = `
					UPDATE post SET person_id_likes = ARRAY_REMOVE(person_id_likes, $1) WHERE id = $2 RETURNING person_id_likes
				`;
				const removeIdFromLikes = db.query(queryForRemoveIdFromLikes, [userId, postId]);

				return Promise.resolve(removeIdFromLikes);
			})
			.then((result) => {
				return { success: true, likesNum: result.rows[0].person_id_likes.length };
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}

	putedLike({ postId, userId }) {
		const queryForCheckIdInLikes = `SELECT id FROM post WHERE id = $1 AND $2 = ANY(person_id_likes)`;
		const findPost = db.query(queryForCheckIdInLikes, [postId, userId]);

		return new Promise((resolve) => resolve(findPost))
			.then((findPost) => {
				return {
					success: true,
					result: Boolean(findPost.rows.length && findPost.rows[0].id)
				};
			})
			.catch((error) => {
				throw new Error(error.message || error);
			});
	}
}

module.exports = new PostLogics();