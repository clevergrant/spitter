import { Attachment, User } from 'app/models'

export interface UserService {
	register: (alias: string, name: string, password: string, photo: Attachment) => Promise<User>
	getUser: (alias: string) => Promise<User>
	getUsers: (aliases: string[], lastId: string, numResults: number) => Promise<User[]>
	getFollowing: (alias: string, lastId: string, numResults: number) => Promise<User[]>
	getFollowers: (alias: string, lastId: string, numResults: number) => Promise<User[]>
}
