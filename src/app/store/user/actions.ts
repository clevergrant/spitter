import {
	UserTypes,
	UserStart,
	UserAbort,
	UserError,
	GetUserSuccess,
	GetUsersSuccess,
	UserClean,
	UserCleanPayload,
	GetUserListSuccess,
} from './types'

import { User } from 'app/models'

export function userStart(): UserStart {
	return {
		type: UserTypes.USER_START,
	}
}

export function userAbort(): UserAbort {
	return {
		type: UserTypes.USER_ABORT,
	}
}

export function userError(error: Error): UserError {
	return {
		type: UserTypes.USER_ERROR,
		payload: {
			error,
		},
	}
}

export function userClean({
	user,
	users,
	userList,
}: UserCleanPayload): UserClean {
	return {
		type: UserTypes.USER_CLEAN,
		payload: {
			user,
			users,
			userList,
		},
	}
}

export function getUserSuccess(user: User): GetUserSuccess {
	return {
		type: UserTypes.GET_USER_SUCCESS,
		payload: {
			user,
		},
	}
}

export function getUsersSuccess(users: User[]): GetUsersSuccess {
	return {
		type: UserTypes.GET_USERS_SUCCESS,
		payload: {
			users,
		},
	}
}

export function getUserListSuccess(users: User[]): GetUserListSuccess {
	return {
		type: UserTypes.GET_USERLIST_SUCCESS,
		payload: {
			users,
		},
	}
}
