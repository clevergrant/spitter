import { Reducer } from 'redux'

import { Status } from 'app/models'

import {
	IStatusService,
	StatusTypes,
	StatusActions,
	StatusActionType,
	StatusStore,
	StatusResult,
	StatusCleanPayload,
	StatusClean,
	GetStoryDone,
	GetFeedDone,
	GetHashtagDone,
	GetStatusDone,
	AddStatusDone,
} from 'app/interfaces/status'

class StatusService implements IStatusService {

	// types

	readonly types = StatusTypes

	// actions

	readonly actions: StatusActions = {
		statusStart: () => ({ type: this.types.STATUS_START }),
		statusAbort: () => ({ type: this.types.STATUS_ABORT }),
		statusError: (error: Error) => ({ type: this.types.STATUS_ERROR, payload: { error } }),
		statusClean: (payload: StatusCleanPayload) => ({ type: this.types.STATUS_CLEAN, payload }),
		getStorySuccess: (statuses: Status[]) => ({ type: this.types.GET_STORY_SUCCESS, payload: { statuses } }),
		getFeedSuccess: (statuses: Status[]) => ({ type: this.types.GET_FEED_SUCCESS, payload: { statuses } }),
		getHashtagSuccess: (statuses: Status[]) => ({ type: this.types.GET_HASHTAG_SUCCESS, payload: { statuses } }),
		getStatusSuccess: (status: Status) => ({ type: this.types.GET_STATUS_SUCCESS, payload: { status } }),
		addStatusSuccess: (status: Status) => ({ type: this.types.ADD_STATUS_SUCCESS, payload: { status } }),
	}

	// default store

	readonly store: StatusStore = {
		lastId: ``,
		numResults: 5,
		loading: false,
		validationMessage: ``,
	}

	// reducer

	readonly reducer: Reducer<StatusStore, StatusActionType> = (store = this.store, action) => {
		switch (action.type) {

		case StatusTypes.STATUS_START:
			return {
				...store,
				loading: true,
				validationMessage: ``,
			}

		case StatusTypes.STATUS_ABORT:
			return {
				...store,
				loading: false,
				validationMessage: `Action Aborted`,
			}

		case StatusTypes.STATUS_ERROR:
			console.error(action.payload.error.message)
			return {
				...store,
				loading: false,
				validationMessage: action.payload.error.message,
			}

		case StatusTypes.STATUS_CLEAN:
			return {
				...store,
				story: action.payload.story ? undefined : store.story,
				feed: action.payload.feed ? undefined : store.feed,
				hashtags: action.payload.hashtags ? undefined : store.hashtags,
				status: action.payload.status ? undefined : store.status,
				lastId: ``,
			}

		case StatusTypes.GET_STORY_SUCCESS:
			return {
				...store,
				story: [...(store.story ? store.story : []), ...action.payload.statuses],
				lastId: action.payload.statuses[action.payload.statuses.length - 1].id,
				loading: false,
				validationMessage: ``,
			}

		case StatusTypes.GET_FEED_SUCCESS:
			return {
				...store,
				feed: [...(store.feed ? store.feed : []), ...action.payload.statuses],
				lastId: action.payload.statuses[action.payload.statuses.length - 1].id,
				loading: false,
				validationMessage: ``,
			}

		case StatusTypes.GET_HASHTAG_SUCCESS:
			return {
				...store,
				hashtags: [...(store.hashtags ? store.hashtags : []), ...action.payload.statuses],
				lastId: action.payload.statuses[action.payload.statuses.length - 1].id,
				loading: false,
				validationMessage: ``,
			}

		case StatusTypes.GET_STATUS_SUCCESS:
		case StatusTypes.ADD_STATUS_SUCCESS:
			return {
				...store,
				status: action.payload.status,
				loading: false,
				validationMessage: ``,
			}

		default:
			return store
		}
	}

	// thunks

	readonly getStory = (alias: string): StatusResult<GetStoryDone> => async (dispatch, getState, { awsProxy }) => {

		const {
			lastId,
			numResults,
		} = getState()

		dispatch(this.actions.statusStart())

		try {
			const statuses = await awsProxy.getStory(alias, lastId, numResults)
			if (!statuses.length) return dispatch(this.actions.statusAbort())
			return dispatch(this.actions.getStorySuccess(statuses))
		} catch (error) {
			return dispatch(this.actions.statusError(error))
		}
	}

	readonly getFeed = (alias: string): StatusResult<GetFeedDone> => async (dispatch, getState, { awsProxy }) => {

		const {
			lastId,
			numResults,
		} = getState()

		dispatch(this.actions.statusStart())

		try {
			const statuses = await awsProxy.getFeed(alias, lastId, numResults)
			if (!statuses.length) return dispatch(this.actions.statusAbort())
			return dispatch(this.actions.getFeedSuccess(statuses))
		} catch (error) {
			return dispatch(this.actions.statusError(error))
		}
	}

	readonly getHashtags = (hashtag: string): StatusResult<GetHashtagDone> => async (dispatch, getState, { awsProxy }) => {

		const {
			lastId,
			numResults,
		} = getState()

		dispatch(this.actions.statusStart())

		try {
			const statuses = await awsProxy.getHashtags(hashtag, lastId, numResults)
			if (!statuses.length) return dispatch(this.actions.statusAbort())
			return dispatch(this.actions.getHashtagSuccess(statuses))
		} catch (error) {
			return dispatch(this.actions.statusError(error))
		}
	}

	readonly getStatus = (id: string): StatusResult<GetStatusDone> => async (dispatch, _getState, { awsProxy }) => {
		dispatch(this.actions.statusStart())
		try {
			const status = await awsProxy.getStatus(id)
			return dispatch(this.actions.getStatusSuccess(status))
		} catch (error) {
			return dispatch(this.actions.statusError(error))
		}
	}

	readonly addStatus = (status: Status): StatusResult<AddStatusDone> => async (dispatch, _getState, { awsProxy }) => {
		dispatch(this.actions.statusStart())
		try {
			await awsProxy.addStatus(status)
			return dispatch(this.actions.addStatusSuccess(status))
		} catch (error) {
			return dispatch(this.actions.statusError(error))
		}
	}

	readonly cleanStatusStore = (store: StatusCleanPayload): StatusResult<StatusClean> => async dispatch => dispatch(this.actions.statusClean(store))

}

export default new StatusService()
