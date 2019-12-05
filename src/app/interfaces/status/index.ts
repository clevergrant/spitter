/* eslint-disable @typescript-eslint/quotes */
import { Status } from 'app/models'
import { Proxies } from 'app/proxy'
import { Action, Reducer } from 'redux'
import { ThunkAction } from 'redux-thunk'

// types

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

// action creators

interface StatusStart extends Action<StatusTypes.STATUS_START> {}
interface StatusAbort extends Action<StatusTypes.STATUS_ABORT> {}
interface StatusError extends Action<StatusTypes.STATUS_ERROR> {
	payload: { error: Error }
}
interface GetStorySuccess extends Action<StatusTypes.GET_STORY_SUCCESS> {
	payload: { statuses: Status[] }
}
interface GetFeedSuccess extends Action<StatusTypes.GET_FEED_SUCCESS> {
	payload: { statuses: Status[] }
}
interface GetHashtagSuccess extends Action<StatusTypes.GET_HASHTAG_SUCCESS> {
	payload: { statuses: Status[] }
}
interface GetStatusSuccess extends Action<StatusTypes.GET_STATUS_SUCCESS> {
	payload: { status: Status }
}
interface AddStatusSuccess extends Action<StatusTypes.ADD_STATUS_SUCCESS> {
	payload: { status: Status }
}

export interface StatusCleanPayload {
	story?: boolean
	feed?: boolean
	hashtags?: boolean
	status?: boolean
}
export interface StatusClean extends Action<StatusTypes.STATUS_CLEAN> {
	payload: StatusCleanPayload
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

// actions

export interface StatusActions {
	readonly statusStart: () => StatusStart
	readonly statusAbort: () => StatusAbort
	readonly statusError: (error: Error) => StatusError
	readonly statusClean: (payload: StatusCleanPayload) => StatusClean
	readonly getStorySuccess: (statuses: Status[]) => GetStorySuccess
	readonly getFeedSuccess: (statuses: Status[]) => GetFeedSuccess
	readonly getHashtagSuccess: (statuses: Status[]) => GetHashtagSuccess
	readonly getStatusSuccess: (status: Status) => GetStatusSuccess
	readonly addStatusSuccess: (status: Status) => AddStatusSuccess
}

// store

export interface StatusStore {
	readonly story?: Status[]
	readonly feed?: Status[]
	readonly hashtags?: Status[]
	readonly status?: Status
	readonly lastKey: string
	readonly numResults: number
	readonly loading: boolean
	readonly validationMessage: string
}

// thunk result type: ThunkAction<[Return Type], [Store Type], [Extra Arg Type], [Action Type(s)]>

export type StatusResult<R> = ThunkAction<Promise<R>, StatusStore, Proxies, StatusActionType>

// service

export interface IStatusService {

	readonly types: typeof StatusTypes
	readonly actions: StatusActions
	readonly store: StatusStore
	readonly reducer: Reducer<StatusStore, StatusActionType>

	readonly getStory: (alias: string) => StatusResult<GetStoryDone>
	readonly getFeed: (alias: string) => StatusResult<GetFeedDone>
	readonly getHashtags: (hashtag: string) => StatusResult<GetHashtagDone>
	readonly getStatus: (alias: string, timestamp: number) => StatusResult<GetStatusDone>
	readonly addStatus: (status: Status) => StatusResult<AddStatusDone>
	readonly cleanStatusStore: (store: StatusCleanPayload) => StatusResult<StatusClean>

}
