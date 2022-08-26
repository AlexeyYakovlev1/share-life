CREATE TABLE person(
	id SERIAL PRIMARY KEY,
	full_name VARCHAR(255) NOT NULL,
	user_name VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
	avatar TEXT NOT NULL DEFAULT 'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg',
	password TEXT NOT NULL,
	roles VARCHAR(255) ARRAY,
	description TEXT DEFAULT 'No description'
);

CREATE TABLE role(
	id SERIAL PRIMARY KEY,
	text VARCHAR(255) NOT NULL DEFAULT 'USER' UNIQUE
);

CREATE TABLE post(
	id SERIAL PRIMARY KEY,
	owner_id INTEGER,
	FOREIGN KEY (owner_id) REFERENCES person (id),
	photos TEXT ARRAY,
	description TEXT,
	location VARCHAR(255)
);

CREATE TABLE comment(
	id SERIAL PRIMARY KEY,
	post_id INTEGER,
	FOREIGN KEY (post_id) REFERENCES post (id),
	owner_id INTEGER,
	FOREIGN KEY (owner_id) REFERENCES person (id),
	text TEXT NOT NULL
);