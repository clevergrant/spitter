/* eslint-disable @typescript-eslint/quotes */

import { Action } from 'redux'
import { User } from 'app/models'

export enum AuthTypes {

	AUTH_START = 'AUTH_START',
	AUTH_ABORT = 'AUTH_ABORT',
	AUTH_ERROR = 'AUTH_ERROR',

	LOGIN_SUCCESS = 'LOGIN_SUCCESS',
	REGISTER_SUCCESS = 'REGISTER_SUCCESS',
	LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',

}

export interface AuthStart extends Action<AuthTypes.AUTH_START> { }
export interface AuthAbort extends Action<AuthTypes.AUTH_ABORT> { }
export interface AuthError extends Action<AuthTypes.AUTH_ERROR> {
	payload: { error: Error }
}

export interface LoginSuccess extends Action<AuthTypes.LOGIN_SUCCESS> {
	payload: { user: User }
}
export interface RegisterSuccess extends Action<AuthTypes.REGISTER_SUCCESS> { }
export interface LogoutSuccess extends Action<AuthTypes.LOGOUT_SUCCESS> { }

export type LoginDone =
	| LoginSuccess
	| AuthError

export type LogoutDone =
	| LogoutSuccess
	| AuthError

export type RegisterDone =
	| RegisterSuccess
	| AuthError

export type AuthActionType =
	| AuthStart
	| AuthAbort
	| AuthError
	| LoginSuccess
	| RegisterSuccess
	| LogoutSuccess
	| LoginDone
	| RegisterDone
	| LogoutDone
