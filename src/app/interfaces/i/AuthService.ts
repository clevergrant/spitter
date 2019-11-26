import { User, Attachment } from 'app/models'

export interface AuthService {
	login: (alias: string, password: string) => Promise<User>
	register: (name: string, alias: string, password: string, photo: Attachment) => Promise<User>
	logout: () => Promise<void>
	check: () => Promise<User>
	// getUser: (alias: string) => Promise<User>
	// getUsers: (aliases: string[]) => Promise<User[]>
}
