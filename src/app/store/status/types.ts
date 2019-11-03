/* eslint-disable @typescript-eslint/quotes */

import { Action } from 'redux'
import { Status } from 'app/models'

export enum StatusTypes {

	STATUS_START = 'STATUS_START',
	STATUS_ABORT = 'STATUS_ABORT',
	STATUS_ERROR = 'STATUS_ERROR',
	STATUS_CLEAN = 'STATUS_CLEAN',

	GET_STORY_SUCCESS = 'GET_STORY_SUCCESS',
	GET_FEED_SUCCESS = 'GET_FEED_SUCCESS',
	GET_HASHTAG_SUCCESS = 'GET_HASHTAG_SUCCESS',
	GET_STATUS_SUCCESS = 'GET_STATUS_SUCCESS',
	ADD_STATUS_SUCCESS = 'ADD_STATUS_SUCCESS',

}

export interface StatusStart extends Action<StatusTypes.STATUS_START> {}
export interface StatusAbort extends Action<StatusTypes.STATUS_ABORT> {}
export interface StatusError extends Action<StatusTypes.STATUS_ERROR> {
 payload: { error: Error }
}
export type StatusCleanPayload = {
	story?: boolean
	feed?: boolean
	hashtags?: boolean
	status?: boolean
}
export interface StatusClean extends Action<StatusTypes.STATUS_CLEAN> {
	payload: StatusCleanPayload
}

export interface GetStorySuccess extends Action<StatusTypes.GET_STORY_SUCCESS> {
	payload: { statuses: Status[] }
}
export interface GetFeedSuccess extends Action<StatusTypes.GET_FEED_SUCCESS> {
	payload: { statuses: Status[] }
}
export interface GetHashtagSuccess extends Action<StatusTypes.GET_HASHTAG_SUCCESS> {
	payload: { statuses: Status[] }
}
export interface GetStatusSuccess extends Action<StatusTypes.GET_STATUS_SUCCESS> {
	payload: { status: Status }
}
export interface AddStatusSuccess extends Action<StatusTypes.ADD_STATUS_SUCCESS> {
	payload: { status: Status }
}

type StatusStop =
	| StatusAbort
	| StatusError

export type GetStoryDone =
	| GetStorySuccess
	| StatusStop

export type GetFeedDone =
	| GetFeedSuccess
	| StatusStop

export type GetHashtagDone =
	| GetHashtagSuccess
	| StatusStop

export type GetStatusDone =
	| GetStatusSuccess
	| StatusStop

export type AddStatusDone =
	| AddStatusSuccess
	| StatusStop

export type StatusActionType =
	| StatusStart
	| StatusAbort
	| StatusError
	| StatusClean
	| GetStorySuccess
	| GetStoryDone
	| GetFeedSuccess
	| GetFeedDone
	| GetHashtagSuccess
	| GetHashtagDone
	| GetStatusSuccess
	| GetStatusDone
	| AddStatusSuccess
	| AddStatusDone
