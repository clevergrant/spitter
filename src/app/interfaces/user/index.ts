import { User } from 'app/models'
import { Action, Reducer } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { Proxies } from 'app/proxy'

// types

export enum UserTypes {

	USER_START = `USER_START`,
	USER_ABORT = `USER_ABORT`,
	USER_ERROR = `USER_ERROR`,
	USER_CLEAN = `USER_CLEAN`,

	GET_USER_SUCCESS = `GET_USER_SUCCESS`,
	GET_USERS_SUCCESS = `GET_USERS_SUCCESS`,
	GET_USER_LIST_SUCCESS = `GET_USER_LIST_SUCCESS`

}

// action creators

interface UserStart extends Action<UserTypes.USER_START> {}
interface UserAbort extends Action<UserTypes.USER_ABORT> {}
interface UserError extends Action<UserTypes.USER_ERROR> {
	payload: { error: Error }
}
interface GetUserSuccess extends Action<UserTypes.GET_USER_SUCCESS> {
	payload: { user: User }
}
interface GetUsersSuccess extends Action<UserTypes.GET_USERS_SUCCESS> {
	payload: { users: User[] }
}
interface GetUserListSuccess extends Action<UserTypes.GET_USER_LIST_SUCCESS> {
	payload: { users: string[] }
}

export type UserCleanPayload = {
	user?: boolean
	users?: boolean
	userList?: boolean
}
export interface UserClean extends Action<UserTypes.USER_CLEAN> {
	payload: UserCleanPayload
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

// actions

export interface UserActions {
	readonly userStart: () => UserStart
	readonly userAbort: () => UserAbort
	readonly userError: (error: Error) => UserError
	readonly userClean: (payload: UserCleanPayload) => UserClean
	readonly getUserSuccess: (user: User) => GetUserSuccess
	readonly getUsersSuccess: (users: User[]) => GetUsersSuccess
	readonly getUserListSuccess: (users: string[]) => GetUserListSuccess
}

// store

export interface UserStore {
	readonly user?: User
	readonly users?: User[]
	readonly userList?: string[]
	readonly lastId: string
	readonly numResults: number
	readonly loading: boolean
	readonly validationMessage: string
}

// thunk result type: ThunkAction<[Return Type], [Store Type], [Extra Arg Type], [Action Type(s)]>

export type UserResult<R> = ThunkAction<Promise<R>, UserStore, Proxies, UserActionType>

// service

export interface IUserService {

	readonly types: typeof UserTypes
	readonly actions: UserActions
	readonly store: UserStore
	readonly reducer: Reducer<UserStore, UserActionType>

	readonly getUser: (alias: string) => UserResult<GetUserDone>
	readonly getFollowing: (alias: string, lastId: string, numResults: number) => UserResult<GetUserListDone>
	readonly getFollowers: (alias: string, lastId: string, numResults: number) => UserResult<GetUserListDone>
	readonly cleanUserStore: (payload: UserCleanPayload) => UserResult<UserClean>

}
