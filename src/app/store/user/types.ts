/* eslint-disable @typescript-eslint/quotes */

import { Action } from 'redux'
import { User } from 'app/models'

export enum UserTypes {

	USER_START = 'USER_START',
	USER_ABORT = 'USER_ABORT',
	USER_ERROR = 'USER_ERROR',
	USER_CLEAN = 'USER_CLEAN',

	GET_USER_SUCCESS = 'GET_USER_SUCCESS',
	GET_USERS_SUCCESS = 'GET_USERS_SUCCESS',
	GET_USER_LIST_SUCCESS = 'GET_USER_LIST_SUCCESS'

}

export interface UserStart extends Action<UserTypes.USER_START> {}
export interface UserAbort extends Action<UserTypes.USER_ABORT> {}
export interface UserError extends Action<UserTypes.USER_ERROR> {
	payload: { error: Error }
}
export type UserCleanPayload = {
	user?: boolean
	users?: boolean
	userList?: boolean
}
export interface UserClean extends Action<UserTypes.USER_CLEAN> {
	payload: UserCleanPayload
}

export interface GetUserSuccess extends Action<UserTypes.GET_USER_SUCCESS> {
	payload: { user: User }
}
export interface GetUsersSuccess extends Action<UserTypes.GET_USERS_SUCCESS> {
	payload: { users: User[] }
}
export interface GetUserListSuccess extends Action<UserTypes.GET_USER_LIST_SUCCESS> {
	payload: { users: string[] }
}

type UserStop =
	| UserError
	| UserAbort

export type GetUserDone =
	| GetUserSuccess
	| UserStop

export type GetUsersDone =
	| GetUsersSuccess
	| UserStop

export type GetUserListDone =
	| GetUserListSuccess
	| UserStop

export type UserActionType =
	| UserStart
	| UserAbort
	| UserError
	| UserClean
	| GetUserSuccess
	| GetUserDone
	| GetUsersSuccess
	| GetUsersDone
	| GetUserListSuccess
	| GetUserListDone
