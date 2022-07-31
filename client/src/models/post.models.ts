export interface IPost {
	id: number;
	ownerId: number;
	photos: Array<string>;
	description: string;
	usersLikesIds: Array<number>;
	usersCommentsIds: Array<number>;
}