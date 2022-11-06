const db = require("../db");
const toBase64 = require("../utils/toBase64.util");

const path = require("path");

const { PROJECT_ROOT } = process.env;

class SearchLogics {
	search({ searchBy }) {
		const queryForFindPosts = `SELECT * FROM post WHERE description LIKE $1`;
		const findPosts = db.query(queryForFindPosts, [searchBy]);

		return new Promise((resolve) => resolve(findPosts))
			.then((findPosts) => {
				// convert photos to base64
				const newPosts = [];

				for (let i = 0; i < findPosts.rows.length; i++) {
					const post = findPosts.rows[i];
					const newPhotos = [];

					for (let j = 0; j < post.photos.length; j++) {
						const photo = post.photos[j];
						const filePath = path.relative(PROJECT_ROOT, `./templates/post/${photo}`);

						newPhotos.push(toBase64(filePath, true));
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
}

module.exports = new SearchLogics();