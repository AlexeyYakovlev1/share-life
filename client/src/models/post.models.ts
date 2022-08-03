export interface IPost {
	id: number;
	ownerId: number;
	photos: Array<string>;
	description?: string;
	usersLikesIds: Array<number>;
	usersCommentsIds: Array<number>;
	location?: string;
}

export interface IComment {
	id: number;
	ownerId: number;
	text: string;
	createdAt: Date | string;
}