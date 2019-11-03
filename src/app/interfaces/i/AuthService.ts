import { User } from 'app/models'

export interface AuthService {
	login: (alias?: string, password?: string) => Promise<User>
	logout: () => Promise<void>
}
