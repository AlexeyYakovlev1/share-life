CREATE TABLE person(
	id SERIAL PRIMARY KEY,
	full_name VARCHAR(255) NOT NULL,
	user_name VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
	avatar TEXT,
	password TEXT NOT NULL,
	roles VARCHAR(255) ARRAY,
	followers INTEGER ARRAY DEFAULT array[]::integer[],
	following INTEGER ARRAY DEFAULT array[]::integer[],
	description TEXT DEFAULT 'No description',
	date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
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
	location VARCHAR(255),
	date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	person_id_likes INTEGER ARRAY DEFAULT array[]::integer[]
);

CREATE TABLE comment(
	id SERIAL PRIMARY KEY,
	post_id INTEGER,
	FOREIGN KEY (post_id) REFERENCES post (id),
	owner_id INTEGER,
	FOREIGN KEY (owner_id) REFERENCES person (id),
	text TEXT NOT NULL,
	date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE follow(
	id SERIAL PRIMARY KEY,
	follower_id INTEGER,
	FOREIGN KEY (follower_id) REFERENCES person (id),
	user_id INTEGER,
	FOREIGN KEY (user_id) REFERENCES person (id)
);

