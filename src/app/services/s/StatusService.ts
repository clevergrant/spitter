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
		prev: {
			story: undefined,
			feed: undefined,
			hashtags: undefined,
		},
		count: 10,
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
				prev: {
					story: action.payload.story ? undefined : store.prev.story,
					feed: action.payload.feed ? undefined : store.prev.feed,
					hashtags: action.payload.hashtags ? undefined : store.prev.hashtags,
				},
			}

		case StatusTypes.GET_STORY_SUCCESS:
			return {
				...store,
				story: action.payload.statuses,
				prev: {
					...store.prev,
					story: action.payload.statuses.length ? `${action.payload.statuses[action.payload.statuses.length - 1].timestamp}` : store.prev.story,
				},
				loading: false,
				validationMessage: ``,
			}

		case StatusTypes.GET_FEED_SUCCESS:
			return {
				...store,
				feed: action.payload.statuses,
				prev: {
					...store.prev,
					feed: action.payload.statuses.length ? `${action.payload.statuses[action.payload.statuses.length - 1].timestamp}` : store.prev.feed,
				},
				loading: false,
				validationMessage: ``,
			}

		case StatusTypes.GET_HASHTAG_SUCCESS:
			return {
				...store,
				hashtags: action.payload.statuses,
				prev: {
					...store.prev,
					hashtags: action.payload.statuses.length ? `${action.payload.statuses[action.payload.statuses.length - 1].timestamp}` : store.prev.hashtags,
				},
				loading: false,
				validationMessage: ``,
			}

		case StatusTypes.ADD_STATUS_SUCCESS:
			return {
				...store,
				feed: [action.payload.status, ...(store.feed ? store.feed : [])],
				prev: {
					...store.prev,
					feed: `${action.payload.status.timestamp}`,
				},
				loading: false,
				validationMessage: ``,
			}

		case StatusTypes.GET_STATUS_SUCCESS:
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
			story,
			prev,
			count,
		} = getState().statusStore

		dispatch(this.actions.statusStart())

		try {
			const statuses = await awsProxy.getStory(alias, count, prev.story)
			if (!story) return dispatch(this.actions.getStorySuccess(statuses))
			if (!statuses.length) return dispatch(this.actions.statusAbort())
			const newStatuses = statuses.filter(s => !story.find(ss => s.id === ss.id))
			if (newStatuses.length) return dispatch(this.actions.getStorySuccess([...story, ...newStatuses]))
			return dispatch(this.actions.statusAbort())
		} catch (error) {
			return dispatch(this.actions.statusError(error))
		}
	}

	readonly getFeed = (alias: string): StatusResult<GetFeedDone> => async (dispatch, getState, { awsProxy }) => {

		const {
			feed,
			prev,
			count,
		} = getState().statusStore

		dispatch(this.actions.statusStart())

		try {
			const statuses = await awsProxy.getFeed(alias, count, prev.feed)
			if (!feed) return dispatch(this.actions.getFeedSuccess(statuses))
			if (!statuses.length) return dispatch(this.actions.statusAbort())
			const newStatuses = statuses.filter(s => !feed.find(ss => s.id === ss.id))
			if (newStatuses.length) return dispatch(this.actions.getFeedSuccess([...feed, ...newStatuses]))
			return dispatch(this.actions.statusAbort())
		} catch (error) {
			return dispatch(this.actions.statusError(error))
		}
	}

	readonly getHashtags = (hashtag: string): StatusResult<GetHashtagDone> => async (dispatch, getState, { awsProxy }) => {

		const {
			hashtags,
			prev,
			count,
		} = getState().statusStore

		dispatch(this.actions.statusStart())

		try {
			const statuses = await awsProxy.getHashtags(hashtag, count, prev.hashtags)
			if (!hashtags) return dispatch(this.actions.getHashtagSuccess(statuses))
			if (!statuses.length) return dispatch(this.actions.statusAbort())
			const newStatuses = statuses.filter(s => !hashtags.find(ss => s.id === ss.id))
			if (newStatuses.length) return dispatch(this.actions.getHashtagSuccess([...hashtags, ...newStatuses]))
			return dispatch(this.actions.statusAbort())
		} catch (error) {
			return dispatch(this.actions.statusError(error))
		}
	}

	readonly getStatus = (alias: string, timestamp: number): StatusResult<GetStatusDone> => async (dispatch, _getState, { awsProxy }) => {
		dispatch(this.actions.statusStart())
		try {
			const status = await awsProxy.getStatus(alias, timestamp)
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
