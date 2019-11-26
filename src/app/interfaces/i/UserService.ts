import { User } from 'app/models'

export interface UserService {
	getAllUsers: () => Promise<User[]>
	getFollowing: (alias: string, lastId: string, numResults: number) => Promise<string[]>
	getFollowers: (alias: string, lastId: string, numResults: number) => Promise<string[]>
}
