import {
	AuthTypes,
	AuthStart,
	AuthAbort,
	AuthError,
	LoginSuccess,
	LogoutSuccess,
	RegisterSuccess,
} from './types'

import { User } from 'app/models'

export function authStart(): AuthStart {
	return {
		type: AuthTypes.AUTH_START,
	}
}

export function authAbort(): AuthAbort {
	return {
		type: AuthTypes.AUTH_ABORT,
	}
}

export function authError(error: Error): AuthError {
	return {
		type: AuthTypes.AUTH_ERROR,
		payload: {
			error,
		},
	}
}

export function loginSuccess(user: User): LoginSuccess {
	return {
		type: AuthTypes.LOGIN_SUCCESS,
		payload: {
			user,
		},
	}
}

export function registerSuccess(): RegisterSuccess {
	return {
		type: AuthTypes.REGISTER_SUCCESS,
	}
}

export function logoutSuccess(): LogoutSuccess {
	return {
		type: AuthTypes.LOGOUT_SUCCESS,
	}
}
