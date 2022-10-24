const db = require("../db");
const path = require("path");
const fs = require("fs");

const { PROJECT_ROOT } = process.env;

class AdminController {
	constructor() {
		this.removeUser = this.removeUser.bind(this);
	}

	_removeCommentForDeletedPost(postId, userId) {
		if (!postId || !userId) {
			throw new Error(`Required arguments not found`);
		};

		const queryForDeleteComment = `DELETE FROM comment WHERE owner_id = $1 OR post_id = $2`;
		const deletedComment = db.query(queryForDeleteComment, [userId, postId]);

		return new Promise((resolve) => resolve(deletedComment));
	}

	// search for users
	searchUsers(req, res) {
		if (!Object.entries(req.query).length || !req.query.q) {
			return res.status(400).json({ success: false, message: "Query `q` must be" });
		}

		const { q: userId } = req.query;

		const queryForFindUser = `SELECT id,user_name,email,full_name FROM person WHERE id = $1`;
		const findUser = db.query(queryForFindUser, [userId]);

		new Promise((resolve) => resolve(findUser))
			.then((findUser) => res.status(200).json({ success: true, person: findUser.rows[0] }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	// search for posts
	searchPosts(req, res) {
		if (!Object.entries(req.query).length || !req.query.q) {
			return res.status(400).json({ success: false, message: "Query `q` must be" });
		}

		const { q: postId } = req.query;

		const queryForFindPost = `SELECT id,description,owner_id FROM post WHERE id = $1`;
		const findPost = db.query(queryForFindPost, [postId]);

		new Promise((resolve) => resolve(findPost))
			.then((findPost) => res.status(200).json({ success: true, post: findPost.rows[0] }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	// search for comments
	searchComments(req, res) {
		if (!Object.entries(req.query).length || !req.query.q) {
			return res.status(400).json({ success: false, message: "Query `q` must be exist" });
		}

		const { q: commentId } = req.query;

		const queryForFindComment = `SELECT id,text,owner_id,post_id FROM comment WHERE id = $1`;
		const findComment = db.query(queryForFindComment, [commentId]);

		new Promise((resolve) => resolve(findComment))
			.then((findComment) => res.status(200).json({ success: true, comment: findComment.rows[0] }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	//  remove user
	removeUser(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must be exist" });
		}

		const { id: userId } = req.params;

		const queryForFindUser = `SELECT id FROM person WHERE id = $1`;
		const findUser = db.query(queryForFindUser, [userId]);

		new Promise((resolve) => resolve(findUser))
			.then((findUser) => {
				// UPDATE ARRAYS FOR PERSONS AND REMOVE FOLLOW
				if (!findUser.rows || !findUser.rows[0].id) Promise.reject("User not found");

				const queryForUpdatePerson = `
					UPDATE person SET followers = ARRAY_REMOVE(followers, $1), following = ARRAY_REMOVE(following, $1)
				`;
				const queryForUpdatePost = `
					UPDATE post SET person_id_likes = ARRAY_REMOVE(person_id_likes, $1)
				`;

				const updatePerson = db.query(queryForUpdatePerson, [userId]);
				const updatePost = db.query(queryForUpdatePost, [userId]);

				return Promise.all([updatePerson, updatePost]);
			})
			.then(() => {
				// FIND POSTS
				const queryForFindPosts = `SELECT id FROM post WHERE owner_id = $1`;
				const findPosts = db.query(queryForFindPosts, [userId]);

				return Promise.resolve(findPosts);
			})
			.then(async (findPosts) => {
				// REMOVE ALL COMMENTS FROM POSTS THEN POSTS FOLLOW AND USER
				if (findPosts.rows && findPosts.rows.length) {
					for (let i = 0; i < findPosts.rows.length; i++) {
						const post = findPosts.rows[i];
						await this._removeCommentForDeletedPost(post.id, userId);
					}
				}

				const queryForDeletePosts = `DELETE FROM post WHERE owner_id = $1`;
				const queryForDeleteFollow = `DELETE FROM follow WHERE user_id = $1 OR follower_id = $1`;
				const queryForDeleteUser = `DELETE FROM person WHERE id = $1`;

				const deletedPost = db.query(queryForDeletePosts, [userId]);
				const deleteFollow = db.query(queryForDeleteFollow, [userId]);
				const deleteUser = db.query(queryForDeleteUser, [userId]);

				return Promise.all([deletedPost, deleteFollow, deleteUser]);
			})
			.then(() => res.status(200).json({ success: true, message: "User has been removed" }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	//  remove post
	removePost(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params must exist" });
		}

		const { id: idPost } = req.params;

		const queryForFindPost = `SELECT photos FROM post WHERE id = $1`;
		const findPost = db.query(queryForFindPost, [idPost]);

		new Promise((resolve) => resolve(findPost))
			.then((findPost) => {
				if (!findPost.rows || !findPost.rows[0]) return Promise.reject("Post is not found");

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

	//  remove comment
	removeComment(req, res) {
		if (!Object.entries(req.params).length || !req.params.id) {
			return res.status(400).json({ success: false, message: "Params has been exist" });
		}

		const { id: commentId } = req.params;
		const queryForFindComment = `SELECT id FROM comment WHERE id = $1`;
		const findComment = db.query(queryForFindComment, [commentId]);

		new Promise((resolve) => resolve(findComment))
			.then((findComment) => {
				if (!findComment.rows.length || !findComment.rows[0]) return Promise.reject("Comment not found");

				const queryForDeleteComment = `DELETE FROM comment WHERE id = $1`;
				const deleteComment = db.query(queryForDeleteComment, [commentId]);

				return Promise.resolve(deleteComment);
			})
			.then(() => res.status(200).json({ success: true, message: "Comment has been removed" }))
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}
}

module.exports = new AdminController();