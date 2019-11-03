import { ThunkAction } from 'redux-thunk'

import { Services } from 'app/services'

import { RootStore } from 'app/store'

import {
	UserActionType,
	GetUserDone,
	GetUsersDone,
	UserCleanPayload,
	UserClean,
	GetUserListDone,
} from './types'

import * as actions from './actions'

// Result type: ThunkAction<[Return Type], [Store Type], [Extra Arg Type], [Action Type(s)]>

export type UserResult<R> = ThunkAction<Promise<R>, RootStore, Services, UserActionType>

export const cleanUserStore = (store: UserCleanPayload): UserResult<UserClean> => async dispatch => dispatch(actions.userClean(store))

export const getUser = (alias: string): UserResult<GetUserDone> =>
	async (dispatch, _getState, { userService }) => {

		dispatch(actions.userStart())

		try {

			const user = await userService.getUser(alias)
			return dispatch(actions.getUserSuccess(user))

		} catch (error) {
			return dispatch(actions.userError(error))
		}
	}

export const getUsers = (aliases: string[]): UserResult<GetUsersDone> =>
	async (dispatch, getState, { userService }) => {

		const {
			lastId,
			numResults,
		} = getState().statusStore

		dispatch(actions.userStart())

		try {

			const users = await userService.getUsers(aliases, lastId, numResults)

			if (!users.length) return dispatch(actions.userAbort())

			return dispatch(actions.getUsersSuccess(users))

		} catch (error) {
			return dispatch(actions.userError(error))
		}
	}

export const getFollowers = (alias: string): UserResult<GetUserListDone> =>
	async (dispatch, getState, { userService }) => {

		const {
			lastId,
			numResults,
		} = getState().statusStore

		dispatch(actions.userStart())

		try {

			const users = await userService.getFollowers(alias, lastId, numResults)

			if (!users.length) return dispatch(actions.userAbort())

			return dispatch(actions.getUserListSuccess(users))

		} catch (error) {
			return dispatch(actions.userError(error))
		}
	}

export const getFollowing = (alias: string): UserResult<GetUserListDone> =>
	async (dispatch, getState, { userService }) => {

		const {
			lastId,
			numResults,
		} = getState().statusStore

		dispatch(actions.userStart())

		try {

			const users = await userService.getFollowing(alias, lastId, numResults)

			if (!users.length) return dispatch(actions.userAbort())

			return dispatch(actions.getUserListSuccess(users))

		} catch (error) {
			return dispatch(actions.userError(error))
		}
	}
