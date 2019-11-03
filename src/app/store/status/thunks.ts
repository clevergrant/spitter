import { ThunkAction } from 'redux-thunk'

import { Services } from 'app/services'
import { Status } from 'app/models'

import { RootStore } from 'app/store'

import {
	StatusActionType,
	GetStoryDone,
	GetFeedDone,
	GetHashtagDone,
	GetStatusDone,
	AddStatusDone,
	StatusCleanPayload,
	StatusClean,
} from './types'

import * as actions from './actions'

// Result type: ThunkAction<[Return Type], [Store Type], [Extra Arg Type], [Action Type(s)]>

export type StatusResult<R> = ThunkAction<Promise<R>, RootStore, Services, StatusActionType>

export const cleanStatusStore = (store: StatusCleanPayload): StatusResult<StatusClean> => async dispatch => dispatch(actions.statusClean(store))

export const getStory = (alias: string): StatusResult<GetStoryDone> =>
	async (dispatch, getState, { statusService }) => {

		const {
			lastId,
			numResults,
		} = getState().statusStore

		dispatch(actions.statusStart())

		try {

			const statuses = await statusService.getStory(alias, lastId, numResults)

			if (!statuses.length) return dispatch(actions.statusAbort())

			return dispatch(actions.getStorySuccess(statuses))

		} catch(error) {
			return dispatch(actions.statusError(error))
		}
	}

export const getFeed = (aliases: string[]): StatusResult<GetFeedDone> =>
	async (dispatch, getState, { statusService }) => {

		const {
			lastId,
			numResults,
		} = getState().statusStore

		dispatch(actions.statusStart())

		try {

			const statuses = await statusService.getFeed(aliases, lastId, numResults)

			if (!statuses.length) return dispatch(actions.statusAbort())

			return dispatch(actions.getFeedSuccess(statuses))

		} catch(error) {
			return dispatch(actions.statusError(error))
		}
	}

export const getHashtag = (hashtag: string): StatusResult<GetHashtagDone> =>
	async (dispatch, getState, { statusService }) => {

		const {
			lastId,
			numResults,
		} = getState().statusStore

		dispatch(actions.statusStart())

		try {

			const statuses = await statusService.getHashtags(hashtag, lastId, numResults)

			if (!statuses.length) return dispatch(actions.statusAbort())

			return dispatch(actions.getHashtagSuccess(statuses))

		} catch (error) {
			return dispatch(actions.statusError(error))
		}
	}

export const getStatus = (id: string): StatusResult<GetStatusDone> =>
	async (dispatch, _getState, { statusService }) => {

		dispatch(actions.statusStart())

		try {

			const status = await statusService.getStatus(id)
			return dispatch(actions.getStatusSuccess(status))

		} catch (error) {
			return dispatch(actions.statusError(error))
		}
	}

export const addStatus = (status: Status): StatusResult<AddStatusDone> =>
	async (dispatch, _getState, { statusService }) => {

		dispatch(actions.statusStart())

		try {

			await statusService.addStatus(status)
			return dispatch(actions.addStatusSuccess(status))

		} catch (error) {
			return dispatch(actions.statusError(error))
		}
	}
