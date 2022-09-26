export interface IPost {
	id: number;
	owner_id: number;
	photos: Array<IPostPhoto>;
	description?: string;
	location?: string;
	date: Date | string;
}

export interface IPostPhoto {
	filename: string;
	base64: string;
}

export interface IComment {
	id: number;
	owner_id: number;
	post_id: number;
	text: string;
	date: Date | string;
}