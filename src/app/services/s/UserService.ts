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
	GetFollowerCountDone,
	GetFollowingCountDone,
	CheckFollowingDone,
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
		getFollowerCountSuccess: (count: number) => ({ type: this.types.GET_FOLLOWER_COUNT_SUCCESS, payload: { count }}),
		getFollowingCountSuccess: (count: number) => ({ type: this.types.GET_FOLLOWING_COUNT_SUCCESS, payload: { count }}),
		userClean: (payload: UserCleanPayload) => ({ type: this.types.USER_CLEAN, payload }),
		checkFollowingSuccess: (isFollower: boolean) => ({ type: this.types.CHECK_FOLLOWING_SUCCESS, payload: { isFollower }}),
	}

	// default store

	readonly store: UserStore = {
		prev: {
			users: undefined,
			following: undefined,
			followers: undefined,
		},
		count: 50,
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
				followerCount: action.payload.followerCount ? undefined : store.followerCount,
				following: action.payload.following ? undefined : store.following,
				followingCount: action.payload.followingCount ? undefined : store.followingCount,
				isFollower: action.payload.isFollower ? undefined : store.isFollower,
				prev: {
					users: action.payload.users ? undefined : store.prev.users,
					followers: action.payload.followers ? undefined : store.prev.followers,
					following: action.payload.following ? undefined : store.prev.following,
				},
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
				followers: action.payload.followers,
				prev: {
					...store.prev,
					followers: action.payload.followers.length ? action.payload.followers[action.payload.followers.length - 1] : store.prev.followers,
				},
				loading: false,
				validationMessage: ``,
			}

		case UserTypes.GET_FOLLOWING_SUCCESS:
			return {
				...store,
				following: action.payload.following,
				prev: {
					...store.prev,
					following: action.payload.following.length ? action.payload.following[action.payload.following.length - 1] : store.prev.following,
				},
				loading: false,
				validationMessage: ``,
			}

		case UserTypes.GET_FOLLOWER_COUNT_SUCCESS:
			return {
				...store,
				followerCount: action.payload.count,
				loading: false,
				validationMessage: ``,
			}

		case UserTypes.GET_FOLLOWING_COUNT_SUCCESS:
			return {
				...store,
				followingCount: action.payload.count,
				loading: false,
				validationMessage: ``,
			}

		case UserTypes.CHECK_FOLLOWING_SUCCESS:
			return {
				...store,
				isFollower: action.payload.isFollower,
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
			prev,
			count,
			followers,
		} = getState().userStore

		dispatch(this.actions.userStart())

		try {
			const newFollowers = await awsProxy.listFollowers(alias, count, prev.followers)
			if (!followers) return dispatch(this.actions.getFollowersSuccess(newFollowers))
			if (!newFollowers.length) return dispatch(this.actions.userAbort())
			const newNewFollowers = newFollowers.filter(a => !followers.find(aa => a === aa))
			if (newNewFollowers.length) return dispatch(this.actions.getFollowersSuccess([...followers, ...newNewFollowers]))
			return dispatch(this.actions.userAbort())
		} catch (error) {
			return dispatch(this.actions.userError(error))
		}
	}

	readonly getFollowing = (alias: string): UserResult<GetFollowingDone> => async (dispatch, getState, { awsProxy }) => {

		const {
			prev,
			count,
			following,
		} = getState().userStore

		dispatch(this.actions.userStart())

		try {

			const newFollowing = await awsProxy.listFollowing(alias, count, prev.followers)

			if (!following) return dispatch(this.actions.getFollowingSuccess(newFollowing))
			if (!newFollowing.length) return dispatch(this.actions.userAbort())

			let modified = false

			following.forEach(a => {
				const found = newFollowing.find(na => na === a)
				if (!found) {
					modified = true
					newFollowing.push(a)
				}
			})

			if (modified) return dispatch(this.actions.getFollowingSuccess(newFollowing))

			return dispatch(this.actions.userAbort())

		} catch (error) {
			return dispatch(this.actions.userError(error))
		}
	}

	readonly getFollowerCount = (alias: string): UserResult<GetFollowerCountDone> => async (dispatch, _getState, { awsProxy }) => {
		dispatch(this.actions.userStart())
		try {
			const count = await awsProxy.getFollowerCount(alias)
			return dispatch(this.actions.getFollowerCountSuccess(count))
		} catch (error) {
			return dispatch(this.actions.userError(error))
		}
	}

	readonly getFollowingCount = (alias: string): UserResult<GetFollowingCountDone> => async (dispatch, _getState, { awsProxy }) => {
		dispatch(this.actions.userStart())
		try {
			const count = await awsProxy.getFollowingCount(alias)
			return dispatch(this.actions.getFollowingCountSuccess(count))
		} catch (error) {
			return dispatch(this.actions.userError(error))
		}
	}

	readonly follow = (follower: string, followee: string): UserResult<GetFollowersDone> => async (dispatch, _getState, { awsProxy }) => {

		dispatch(this.actions.userStart())

		try {

			const following = await awsProxy.follow(follower, followee)
			const followerCount = await awsProxy.getFollowerCount(followee)
			const isFollowing = await awsProxy.checkFollowing(follower, followee)

			dispatch(this.actions.getFollowerCountSuccess(followerCount))
			dispatch(this.actions.checkFollowingSuccess(isFollowing))
			return dispatch(this.actions.getFollowersSuccess(following))

		} catch (error) {
			return dispatch(this.actions.userError(error))
		}
	}

	readonly unfollow = (follower: string, followee: string): UserResult<GetFollowersDone> => async (dispatch, _getState, { awsProxy }) => {

		dispatch(this.actions.userStart())

		try {
			const following = await awsProxy.unfollow(follower, followee)

			const followerCount = await awsProxy.getFollowerCount(followee)
			dispatch(this.actions.getFollowerCountSuccess(followerCount))

			const isFollowing = await awsProxy.checkFollowing(follower, followee)
			dispatch(this.actions.checkFollowingSuccess(isFollowing))

			return dispatch(this.actions.getFollowersSuccess(following))
		} catch (error) {
			return dispatch(this.actions.userError(error))
		}
	}

	readonly cleanUserStore = (payload: UserCleanPayload): UserResult<UserClean> => async dispatch => dispatch(this.actions.userClean(payload))

	readonly checkFollowing = (follower: string, followee: string): UserResult<CheckFollowingDone> => async (dispatch, _getState, { awsProxy }) => {
		dispatch(this.actions.userStart())

		try {

			const isFollowing = await awsProxy.checkFollowing(follower, followee)
			return dispatch(this.actions.checkFollowingSuccess(isFollowing))

		} catch (error) {
			return dispatch(this.actions.userError(error))
		}
	}

}

export default new UserService()
