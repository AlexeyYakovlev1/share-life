const { validationResult } = require("express-validator");
const db = require("../db");

class Post {
	create(req, res) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ success: false, errors: errors.array() });
		}

		const { id } = req.user;

		const queryForFindPerson = `SELECT email FROM person WHERE id = $1`;
		const { description, location } = req.body;

		new Promise((resolve) => resolve(db.query(queryForFindPerson, [id])))
			.then((findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) return Promise.reject("Owner is not found");

				const queryForCreatePost = `INSERT INTO post(description,location,owner_id) VALUES($1,$2,$3) RETURNING *`;
				const newPost = db.query(queryForCreatePost, [description, location, id]);

				return Promise.resolve(newPost);
			})
			.then((newPost) => {
				return res.status(201).json({ success: true, message: "Post has been created", post: newPost.rows[0] });
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

				const queryForFindPost = `SELECT owner_id FROM post WHERE id = $1`;
				const findPost = db.query(queryForFindPost, [idPost]);

				return Promise.resolve(findPost);
			})
			.then((findPost) => {
				if (!findPost.rows || !findPost.rows[0]) return Promise.reject("Post is not found");
				if (+findPost.rows[0].owner_id !== +idCurrentUser) return Promise.reject("Access closed");

				const queryForDeletePost = `DELETE FROM post WHERE id = $1`;

				return Promise.resolve(db.query(queryForDeletePost, [idPost]));
			})
			.then(() => {
				return res.status(200).json({ success: true, message: "Post has been removed" });
			})
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
				if (!posts.rows) return Promise.reject("Posts not found");
				return res.status(200).json({ success: true, posts: posts.rows });
			})
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }));
	}

	getAll(req, res) {
		const queryForFindPosts = `SELECT * FROM post`;
		new Promise((resolve) => resolve(db.query(queryForFindPosts)))
			.then((posts) => res.status(200).json({ success: true, posts: posts.rows }))
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

				return res.status(200).json({ success: true, post: findPost.rows[0] });
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

		new Promise((resolve) => resolve(db.query(queryForFindPerson, [idCurrentUser])))
			.then((findPerson) => {
				if (!findPerson.rows || !findPerson.rows[0]) return Promise.reject("User is not found");

				const queryForFindPost = `SELECT owner_id FROM post WHERE id = $1`;
				const findPost = db.query(queryForFindPost, [idPost]);

				return Promise.resolve(findPost);
			})
			.then((findPost) => {
				if (!findPost.rows || !findPost.rows[0]) return Promise.reject("Post is not found");
				if (+idCurrentUser !== findPost.rows[0].owner_id) return Promise.reject("Access closed");

				const queryForUpdatePost = `UPDATE post SET description=$1, location=$2, photos=$3 WHERE id=$4 RETURNING *`;
				const updatePost = db.query(queryForUpdatePost, [description, location, photos, idPost]);

				return Promise.resolve(updatePost);
			})
			.then((updatePost) => {
				return res.status(200).json({ success: true, message: "Post has been updated", post: updatePost.rows[0] });
			})
			.catch((error) => res.status(400).json({ success: false, message: error.message, error }))
	}
}

module.exports = new Post();