import {
	StatusTypes,
	StatusStart,
	StatusAbort,
	StatusError,
	GetStorySuccess,
	GetFeedSuccess,
	GetHashtagSuccess,
	GetStatusSuccess,
	AddStatusSuccess,
	StatusClean,
	StatusCleanPayload,
} from './types'

import { Status } from 'app/models'

export function statusStart(): StatusStart {
	return { type: StatusTypes.STATUS_START }
}

export function statusAbort(): StatusAbort {
	return { type: StatusTypes.STATUS_ABORT }
}

export function statusError(error: Error): StatusError {
	return {
		type: StatusTypes.STATUS_ERROR,
		payload: { error },
	}
}

export function statusClean({
	story,
	feed,
	hashtags,
	status,
}: StatusCleanPayload): StatusClean {
	return {
		type: StatusTypes.STATUS_CLEAN,
		payload: {
			story,
			feed,
			hashtags,
			status,
		},
	}
}

export function getStorySuccess(statuses: Status[]): GetStorySuccess {
	return {
		type: StatusTypes.GET_STORY_SUCCESS,
		payload: { statuses },
	}
}

export function getFeedSuccess(statuses: Status[]): GetFeedSuccess {
	return {
		type: StatusTypes.GET_FEED_SUCCESS,
		payload: { statuses },
	}
}

export function getHashtagSuccess(statuses: Status[]): GetHashtagSuccess {
	return {
		type: StatusTypes.GET_HASHTAG_SUCCESS,
		payload: { statuses },
	}
}

export function getStatusSuccess(status: Status): GetStatusSuccess {
	return {
		type: StatusTypes.GET_STATUS_SUCCESS,
		payload: { status },
	}
}

export function addStatusSuccess(status: Status): AddStatusSuccess {
	return {
		type: StatusTypes.ADD_STATUS_SUCCESS,
		payload: { status },
	}
}
