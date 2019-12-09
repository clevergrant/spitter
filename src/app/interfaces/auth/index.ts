/* eslint-disable @typescript-eslint/quotes */

import { User, Attachment } from 'app/models'
import { ThunkAction } from 'redux-thunk'
import { Proxies } from 'app/proxy'
import { Action, Reducer } from 'redux'
import { RootStore } from 'app/services/store'

// types

export enum AuthTypes {

	AUTH_START = 'AUTH_START',
	AUTH_ABORT = 'AUTH_ABORT',
	AUTH_ERROR = 'AUTH_ERROR',

	LOGIN_SUCCESS = 'LOGIN_SUCCESS',
	LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',

	EDIT_USER_SUCCESS = 'EDIT_USER_SUCCESS',

}

// action creators

interface AuthStart extends Action<AuthTypes.AUTH_START> { }
interface AuthAbort extends Action<AuthTypes.AUTH_ABORT> { }
interface AuthError extends Action<AuthTypes.AUTH_ERROR> {
	payload: { error: Error }
}
interface LoginSuccess extends Action<AuthTypes.LOGIN_SUCCESS> {
	payload: { user: User }
}
interface LogoutSuccess extends Action<AuthTypes.LOGOUT_SUCCESS> { }
interface EditUserSuccess extends Action<AuthTypes.EDIT_USER_SUCCESS> {
	payload: { user: User }
}

export type LoginDone =
| AuthError
| LoginSuccess

export type LogoutDone =
| AuthError
| LogoutSuccess

export type EditUserDone =
| AuthError
| EditUserSuccess

export type AuthActionType =
| AuthStart
| AuthAbort
| AuthError
| LoginSuccess
| LogoutSuccess
| EditUserSuccess
| LoginDone
| LogoutDone
| EditUserDone

// actions

export interface AuthActions {
	readonly authStart: () => AuthStart
	readonly authAbort: () => AuthAbort
	readonly authError: (error: Error) => AuthError
	readonly loginSuccess: (user: User) => LoginSuccess
	readonly logoutSuccess: () => LogoutSuccess
	readonly editUserSuccess: (user: User) => EditUserSuccess
}

// store

export interface AuthStore {
	readonly user?: User
	readonly loading: boolean
	readonly validationMessage: string
}

// thunk result type: ThunkAction<[Return Type], [Store Type], [Extra Arg Type], [Action Type(s)]>

export type AuthResult<R> = ThunkAction<Promise<R>, RootStore, Proxies, AuthActionType>

// service

export interface IAuthService {

	readonly types: typeof AuthTypes
	readonly actions: AuthActions
	readonly store: AuthStore
	readonly reducer: Reducer<AuthStore, AuthActionType>

	readonly login: (alias: string, password: string) => AuthResult<LoginDone>
	readonly register: (name: string, alias: string, password: string, photo: Attachment) => AuthResult<LoginDone>
	readonly logout: (global: boolean) => AuthResult<LogoutDone>
	readonly check: () => AuthResult<LoginDone>
	readonly editUser: (user: User) => AuthResult<EditUserDone>

}
