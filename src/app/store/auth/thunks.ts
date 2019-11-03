import { ThunkAction } from 'redux-thunk'

import { Services } from 'app/services'
import { User, Attachment } from 'app/models'
import { RootStore } from 'app/store'

import {
	AuthActionType,
	LoginDone,
	LogoutDone,
} from './types'

import * as actions from './actions'

// Result type: ThunkAction<[Return Type], [Store Type], [Extra Arg Type], [Action Type(s)]>

export type AuthResult<R> = ThunkAction<Promise<R>, RootStore, Services, AuthActionType>

export const login = (alias?: string, password?: string): AuthResult<LoginDone> =>
	async (dispatch, _getState, { authService }) => {

		dispatch(actions.authStart())

		try {

			const currentUser = await authService.login().catch(error => console.log(error))

			if (currentUser) return dispatch(actions.loginSuccess(currentUser))

			if (alias && password) {
				const result: User = await authService.login(alias, password)
				return dispatch(actions.loginSuccess(result))
			}

			throw new Error(`User not logged in.`)

		} catch (error) {
			return dispatch(actions.authError(error))
		}

	}

export const register = (name: string, alias: string, password: string, photo: Attachment): AuthResult<LoginDone> =>
	async (dispatch, _getState, { userService }) => {

		dispatch(actions.authStart())

		try {

			const result = await userService.register(name, alias, password, photo)
			return dispatch(actions.loginSuccess(result))

		} catch (error) {
			return dispatch(actions.authError(error))
		}

	}

export const logout = (): AuthResult<LogoutDone> =>
	async (dispatch, _getState, services) => {

		dispatch(actions.authStart())

		try {

			await services.authService.logout()
			return dispatch(actions.logoutSuccess())

		} catch (error) {
			return dispatch(actions.authError(error))
		}
	}
