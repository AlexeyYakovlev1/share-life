export interface IPerson {
	id: number;
	full_name: string;
	user_name: string;
	email: string;
	avatar: {
		base64: string;
		filename: string;
	};
	password: string;
	roles: Array<string>;
	description: string;
}