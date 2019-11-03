import { User } from 'app/models'

export default interface UserStore {
	readonly user?: User
	readonly users?: User[]
	readonly userList?: User[]
	readonly lastId: string
	readonly numResults: number
	readonly loading: boolean
	readonly validationMessage: string
}

export const initialUserStore: UserStore = {
	lastId: ``,
	numResults: 5,
	loading: false,
	validationMessage: ``,
}
