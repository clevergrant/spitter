import { Reducer } from 'redux'

import { AuthActionType, AuthTypes } from './types'
import AuthStore, { initialAuthStore } from './stores'

const authReducer: Reducer<AuthStore, AuthActionType> = (
	store = initialAuthStore,
	action,
) => {
	switch (action.type) {

	case AuthTypes.AUTH_START:
		return {
			...store,
			loading: true,
			validationMessage: ``,
		}

	case AuthTypes.AUTH_ERROR:
		console.error(action.payload.error.message)
		return {
			...store,
			user: undefined,
			loading: false,
			validationMessage: action.payload.error.message,
		}

	case AuthTypes.LOGIN_SUCCESS:
		return {
			...store,
			user: action.payload.user,
			loading: false,
			validationMessage: ``,
		}

	case AuthTypes.LOGOUT_SUCCESS:
		return {
			...store,
			user: undefined,
			loading: false,
			validationMessage: ``,
		}

	default:
		return store
	}
}

export default authReducer
