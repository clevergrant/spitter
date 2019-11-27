// import { AuthService } from 'app/interfaces'
import { Reducer } from 'redux'
import { User, Attachment } from 'app/models'

import {
	IAuthService,
	AuthTypes,
	AuthActions,
	AuthActionType,
	AuthStore,
	AuthResult,
	LoginDone,
	LogoutDone,
} from 'app/interfaces/auth'

class AuthService implements IAuthService {

	// types

	readonly types = AuthTypes

	// action creators

	readonly actions: AuthActions = {
		authStart: () => ({ type: this.types.AUTH_START }),
		authAbort: () => ({ type: this.types.AUTH_ABORT }),
		authError: (error: Error) => ({ type: this.types.AUTH_ERROR, payload: { error } }),
		loginSuccess: (user: User) => ({ type: this.types.LOGIN_SUCCESS, payload: { user }}),
		logoutSuccess: () => ({ type: this.types.LOGOUT_SUCCESS }),
	}

	// default store

	readonly store: AuthStore = {
		loading: true,
		validationMessage: ``,
	}

	// reducer

	readonly reducer: Reducer<AuthStore, AuthActionType> = (store = this.store, action) => {
		switch (action.type) {

		case this.types.AUTH_START:
			return {
				...store,
				loading: true,
				validationMessage: ``,
			}

		case this.types.AUTH_ERROR:
			console.error(action.payload.error)
			return {
				...store,
				user: undefined,
				loading: false,
				validationMessage: action.payload.error.message,
			}

		case this.types.LOGIN_SUCCESS:
			return {
				...store,
				user: action.payload.user,
				loading: false,
				validationMessage: ``,
			}

		case this.types.LOGOUT_SUCCESS:
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

	// thunks

	readonly login = (alias: string, password: string): AuthResult<LoginDone> => async (dispatch, _getState, { awsProxy }) => {
		dispatch(this.actions.authStart())
		try {
			const currentUser = await awsProxy.login(alias, password)
			return dispatch(this.actions.loginSuccess(currentUser))
		} catch (error) {
			return dispatch(this.actions.authError(error))
		}
	}

	readonly register = (name: string, alias: string, password: string, photo: Attachment): AuthResult<LoginDone> => async (dispatch, _getState, { awsProxy }) => {
		dispatch(this.actions.authStart())
		try {
			const currentUser = await awsProxy.register(name, alias, password, photo).then(() => awsProxy.login(alias, password))
			return dispatch(this.actions.loginSuccess(currentUser))
		} catch (error) {
			return dispatch(this.actions.authError(error))
		}
	}

	readonly logout = (global: boolean): AuthResult<LogoutDone> => async (dispatch, _getState, { awsProxy }) => {
		dispatch(this.actions.authStart())
		try {
			await awsProxy.logout(global)
			return dispatch(this.actions.logoutSuccess())
		} catch (error) {
			return dispatch(this.actions.authError(error))
		}
	}

	readonly check = (): AuthResult<LoginDone> => async (dispatch, _getState, { awsProxy }) => {
		dispatch(this.actions.authStart())
		try {
			const user = await awsProxy.check()
			return dispatch(this.actions.loginSuccess(user))
		} catch (error) {
			return dispatch(this.actions.authError(error))
		}
	}
}

export default new AuthService()
