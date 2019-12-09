/* eslint-disable @typescript-eslint/quotes */
import { User } from 'app/models'
import { Action, Reducer } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { Proxies } from 'app/proxy'
import { RootStore } from 'app/services/store'

// types

export enum UserTypes {

	USER_START = 'USER_START',
	USER_ABORT = 'USER_ABORT',
	USER_ERROR = 'USER_ERROR',
	USER_CLEAN = 'USER_CLEAN',

	GET_USER_SUCCESS = 'GET_USER_SUCCESS',
	GET_USERS_SUCCESS = 'GET_USERS_SUCCESS',
	GET_FOLLOWERS_SUCCESS = 'GET_FOLLOWERS_SUCCESS',
	GET_FOLLOWING_SUCCESS = 'GET_FOLLOWING_SUCCESS',

	GET_FOLLOWER_COUNT_SUCCESS = 'GET_FOLLOWER_COUNT_SUCCESS',
	GET_FOLLOWING_COUNT_SUCCESS = 'GET_FOLLOWING_COUNT_SUCCESS',

	CHECK_FOLLOWING_SUCCESS = 'CHECK_FOLLOWING_SUCCESS',

}

// action creators

interface UserStart extends Action<UserTypes.USER_START> {}
interface UserAbort extends Action<UserTypes.USER_ABORT> {}
interface UserError extends Action<UserTypes.USER_ERROR> {
	payload: { error: Error }
}
interface GetUserSuccess extends Action<UserTypes.GET_USER_SUCCESS> {
	payload: { user: User }
}
interface GetUsersSuccess extends Action<UserTypes.GET_USERS_SUCCESS> {
	payload: { users: User[] }
}
interface GetFollowersSuccess extends Action<UserTypes.GET_FOLLOWERS_SUCCESS> {
	payload: { followers: string[] }
}
interface GetFollowingSuccess extends Action<UserTypes.GET_FOLLOWING_SUCCESS> {
	payload: { following: string[] }
}
interface GetFollowerCountSuccess extends Action<UserTypes.GET_FOLLOWER_COUNT_SUCCESS> {
	payload: { count: number }
}
interface GetFollowingCountSuccess extends Action<UserTypes.GET_FOLLOWING_COUNT_SUCCESS> {
	payload: { count: number }
}
interface CheckFollowingSuccess extends Action<UserTypes.CHECK_FOLLOWING_SUCCESS> {
	payload: { isFollower: boolean }
}

export type UserCleanPayload = {
	user?: boolean
	users?: boolean
	followers?: boolean
	following?: boolean
	followerCount?: boolean
	followingCount?: boolean
	isFollower?: boolean
}
export interface UserClean extends Action<UserTypes.USER_CLEAN> {
	payload: UserCleanPayload
}

type UserStop =
| UserError
| UserAbort

export type GetUserDone =
| GetUserSuccess
| UserStop

export type GetUsersDone =
| GetUsersSuccess
| UserStop

export type GetFollowersDone =
| GetFollowersSuccess
| UserStop

export type GetFollowingDone =
| GetFollowingSuccess
| UserStop

export type GetFollowerCountDone =
| GetFollowerCountSuccess
| UserStop

export type GetFollowingCountDone =
| GetFollowingCountSuccess
| UserStop

export type CheckFollowingDone =
| CheckFollowingSuccess
| UserStop

export type UserActionType =
| UserStart
| UserAbort
| UserError
| UserClean
| GetUserSuccess
| GetUserDone
| GetUsersSuccess
| GetUsersDone
| GetFollowersSuccess
| GetFollowersDone
| GetFollowingSuccess
| GetFollowingDone
| GetFollowerCountSuccess
| GetFollowerCountDone
| GetFollowingCountSuccess
| GetFollowingCountDone
| CheckFollowingSuccess
| CheckFollowingDone

// actions

export interface UserActions {
	readonly userStart: () => UserStart
	readonly userAbort: () => UserAbort
	readonly userError: (error: Error) => UserError
	readonly userClean: (payload: UserCleanPayload) => UserClean
	readonly getUserSuccess: (user: User) => GetUserSuccess
	readonly getUsersSuccess: (users: User[]) => GetUsersSuccess
	readonly getFollowersSuccess: (followers: string[]) => GetFollowersSuccess
	readonly getFollowingSuccess: (following: string[]) => GetFollowingSuccess
	readonly getFollowerCountSuccess: (count: number) => GetFollowerCountSuccess
	readonly getFollowingCountSuccess: (count: number) => GetFollowingCountSuccess
	readonly checkFollowingSuccess: (isFollower: boolean) => CheckFollowingSuccess
}

// store

export interface UserStore {
	readonly user?: User
	readonly users?: User[]
	readonly followers?: string[]
	readonly followerCount?: number
	readonly following?: string[]
	readonly followingCount?: number
	readonly isFollower?: boolean
	readonly prev: {
		users?: string
		followers?: string
		following?: string
	}
	readonly count: number
	readonly loading: boolean
	readonly validationMessage: string
}

// thunk result type: ThunkAction<[Return Type], [Store Type], [Extra Arg Type], [Action Type(s)]>

export type UserResult<R> = ThunkAction<Promise<R>, RootStore, Proxies, UserActionType>

// service

export interface IUserService {

	readonly types: typeof UserTypes
	readonly actions: UserActions
	readonly store: UserStore
	readonly reducer: Reducer<UserStore, UserActionType>

	readonly getUser: (alias: string) => UserResult<GetUserDone>
	readonly getUsers: (aliases: string[]) => UserResult<GetUsersDone>
	readonly getFollowers: (alias: string) => UserResult<GetFollowersDone>
	readonly getFollowing: (alias: string) => UserResult<GetFollowingDone>
	readonly getFollowerCount: (alias: string) => UserResult<GetFollowerCountDone>
	readonly getFollowingCount: (alias: string) => UserResult<GetFollowingCountDone>
	readonly follow: (follower: string, followee: string) => UserResult<GetFollowersDone>
	readonly unfollow: (follower: string, followee: string) => UserResult<GetFollowersDone>
	readonly cleanUserStore: (payload: UserCleanPayload) => UserResult<UserClean>
	readonly checkFollowing: (follower: string, followee: string) => UserResult<CheckFollowingDone>

}
