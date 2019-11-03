import { Reducer } from 'redux'

import { UserActionType, UserTypes } from './types'
import UserStore, { initialUserStore } from './stores'

const userReducer: Reducer<UserStore, UserActionType> = (
	store = initialUserStore,
	action,
) => {
	switch (action.type) {

	case UserTypes.USER_START:
		return {
			...store,
			loading: true,
			validationMessage: ``,
		}

	case UserTypes.USER_ABORT:
		return {
			...store,
			loading: false,
			validationMessage: `Action Aborted`,
		}

	case UserTypes.USER_ERROR:
		console.error(action.payload.error.message)
		return {
			...store,
			loading: false,
			validationMessage: action.payload.error.message,
		}

	case UserTypes.USER_CLEAN:
		return {
			...store,
			user: action.payload.user ? undefined : store.user,
			users: action.payload.users ? undefined : store.users,
			userList: action.payload.userList ? undefined : store.userList,
			lastId: ``,
		}

	case UserTypes.GET_USER_SUCCESS:
		return {
			...store,
			user: action.payload.user,
			loading: false,
			validationMessage: ``,
		}

	case UserTypes.GET_USERS_SUCCESS:
		return {
			...store,
			users: action.payload.users,
			loading: false,
			validationMessage: ``,
		}

	case UserTypes.GET_USERLIST_SUCCESS:
		return {
			...store,
			userList: [...(store.users ? store.users : []), ...action.payload.users],
			lastId: action.payload.users[action.payload.users.length - 1].id,
			loading: false,
			validationMessage: ``,
		}

	default:
		return store
	}
}

export default userReducer
