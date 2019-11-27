import { Reducer } from 'redux'

import { User } from 'app/models'

import {
	IUserService,
	UserTypes,
	UserActions,
	UserActionType,
	UserStore,
	UserResult,
	UserCleanPayload,
	GetUserDone,
	UserClean,
	GetUserListDone,
} from 'app/interfaces/user'

class UserService implements IUserService {

	// types

	readonly types = UserTypes

	// actions

	readonly actions: UserActions = {
		userStart: () => ({ type: this.types.USER_START }),
		userAbort: () => ({ type: this.types.USER_ABORT }),
		userError: (error: Error) => ({ type: this.types.USER_ERROR, payload: { error } }),
		getUserSuccess: (user: User) => ({ type: this.types.GET_USER_SUCCESS, payload: { user } }),
		getUsersSuccess: (users: User[]) => ({ type: this.types.GET_USERS_SUCCESS, payload: { users } }),
		getUserListSuccess: (users: string[]) => ({ type: this.types.GET_USER_LIST_SUCCESS, payload: { users } }),
		userClean: (payload: UserCleanPayload) => ({ type: this.types.USER_CLEAN, payload }),
	}

	// default store

	readonly store: UserStore = {
		lastId: ``,
		numResults: 5,
		loading: false,
		validationMessage: ``,
	}

	// reducer

	readonly reducer: Reducer<UserStore, UserActionType> = (store = this.store, action) => {
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

		case UserTypes.GET_USER_LIST_SUCCESS:
			return {
				...store,
				userList: [...(store.userList ? store.userList : []), ...action.payload.users],
				lastId: action.payload.users[action.payload.users.length - 1],
				loading: false,
				validationMessage: ``,
			}

		default:
			return store
		}
	}

	// thunks

	readonly getUser = (alias: string): UserResult<GetUserDone> => async (dispatch, _getState, { awsProxy }) => {

		dispatch(this.actions.userStart())

		try {

			const user = await awsProxy.getUser(alias)
			return dispatch(this.actions.getUserSuccess(user))

		} catch (error) {
			return dispatch(this.actions.userError(error))
		}
	}

	readonly getFollowers = (alias: string): UserResult<GetUserListDone> => async (dispatch, getState, { awsProxy }) => {

		const {
			lastId,
			numResults,
		} = getState()

		dispatch(this.actions.userStart())

		try {
			const users = await awsProxy.listFollowers(alias, lastId, numResults)
			if (!users.length) return dispatch(this.actions.userAbort())
			return dispatch(this.actions.getUserListSuccess(users))
		} catch (error) {
			return dispatch(this.actions.userError(error))
		}
	}

	readonly getFollowing = (alias: string): UserResult<GetUserListDone> => async (dispatch, getState, { awsProxy }) => {

		const {
			lastId,
			numResults,
		} = getState()

		dispatch(this.actions.userStart())

		try {
			const users = await awsProxy.listFollowing(alias, lastId, numResults)
			if (!users.length) return dispatch(this.actions.userAbort())
			return dispatch(this.actions.getUserListSuccess(users))
		} catch (error) {
			return dispatch(this.actions.userError(error))
		}
	}

	readonly cleanUserStore = (payload: UserCleanPayload): UserResult<UserClean> => async dispatch => dispatch(this.actions.userClean(payload))
}

export default new UserService()
