import { Status } from 'app/models'

export default interface StatusStore {
	readonly story?: Status[]
	readonly feed?: Status[]
	readonly hashtags?: Status[]
	readonly status?: Status
	readonly lastId: string
	readonly numResults: number
	readonly loading: boolean
	readonly validationMessage: string
}

export const initialStatusStore: StatusStore = {
	lastId: ``,
	numResults: 5,
	loading: false,
	validationMessage: ``,
}
