CREATE TABLE person(
	id SERIAL PRIMARY KEY,
	full_name VARCHAR(255) NOT NULL,
	user_name VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
	avatar TEXT NOT NULL DEFAULT 'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg',
	password TEXT NOT NULL
);