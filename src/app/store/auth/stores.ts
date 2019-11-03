import { User } from 'app/models'

export default interface AuthStore {
	readonly user?: User
	readonly loading: boolean
	readonly validationMessage: string
}

export const initialAuthStore: AuthStore = {
	loading: true,
	validationMessage: ``,
}
