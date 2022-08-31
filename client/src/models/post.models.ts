export interface IPost {
	id: number;
	owner_id: number;
	photos: Array<string>;
	description?: string;
	location?: string;
}

export interface IComment {
	id: number;
	owner_id: number;
	post_id: number;
	text: string;
	createdAt: Date | string;
}