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
	GetFollowersDone,
	GetFollowingDone,
	GetUsersDone,
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
		getFollowersSuccess: (followers: string[]) => ({ type: this.types.GET_FOLLOWERS_SUCCESS, payload: { followers } }),
		getFollowingSuccess: (following: string[]) => ({ type: this.types.GET_FOLLOWING_SUCCESS, payload: { following } }),
		userClean: (payload: UserCleanPayload) => ({ type: this.types.USER_CLEAN, payload }),
	}

	// default store

	readonly store: UserStore = {
		lastKey: ``,
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
				followers: action.payload.followers ? undefined : store.followers,
				following: action.payload.following ? undefined : store.following,
				lastKey: ``,
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

		case UserTypes.GET_FOLLOWERS_SUCCESS:
			return {
				...store,
				userList: [...(store.followers ? store.followers : []), ...action.payload.followers],
				lastKey: action.payload.followers[action.payload.followers.length - 1],
				loading: false,
				validationMessage: ``,
			}

		case UserTypes.GET_FOLLOWING_SUCCESS:
			return {
				...store,
				userList: [...(store.following ? store.following : []), ...action.payload.following],
				lastKey: action.payload.following[action.payload.following.length - 1],
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

	readonly getUsers = (aliases: string[]): UserResult<GetUsersDone> => async (dispatch, _getState, { awsProxy }) => {

		dispatch(this.actions.userStart())

		try {

			const users: User[] = await awsProxy.getUsers(aliases)
			return dispatch(this.actions.getUsersSuccess(users))

		} catch (error) {
			return dispatch(this.actions.userError(error))
		}

	}

	readonly getFollowers = (alias: string): UserResult<GetFollowersDone> => async (dispatch, getState, { awsProxy }) => {

		const {
			lastKey: lastId,
			numResults,
		} = getState()

		dispatch(this.actions.userStart())

		try {
			const followers = await awsProxy.listFollowers(alias, lastId, numResults)
			if (!followers.length) return dispatch(this.actions.userAbort())
			return dispatch(this.actions.getFollowersSuccess(followers))
		} catch (error) {
			return dispatch(this.actions.userError(error))
		}
	}

	readonly getFollowing = (alias: string): UserResult<GetFollowingDone> => async (dispatch, getState, { awsProxy }) => {

		const {
			lastKey,
			numResults,
		} = getState()

		dispatch(this.actions.userStart())

		try {
			const users = await awsProxy.listFollowing(alias, lastKey, numResults)
			if (!users.length) return dispatch(this.actions.userAbort())
			return dispatch(this.actions.getFollowingSuccess(users))
		} catch (error) {
			return dispatch(this.actions.userError(error))
		}
	}

	readonly cleanUserStore = (payload: UserCleanPayload): UserResult<UserClean> => async dispatch => dispatch(this.actions.userClean(payload))
}

export default new UserService()
