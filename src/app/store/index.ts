import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import thunk from 'redux-thunk'

import services, { Services } from 'app/services'

import AuthStore, { initialAuthStore } from './auth/stores'
import StatusStore, { initialStatusStore } from './status/stores'
import UserStore, { initialUserStore } from './user/stores'

import authReducer from './auth/reducers'
import statusReducer from './status/reducers'
import userReducer from './user/reducers'

import { AuthActionType } from './auth/types'
import { StatusActionType } from './status/types'
import { UserActionType } from './user/types'

import {
	login,
	register,
	logout,
} from './auth/thunks'

import {
	cleanStatusStore,
	getStory,
	getFeed,
	getHashtag,
	getStatus,
	addStatus,
} from './status/thunks'

import {
	cleanUserStore,
	getUser,
	getUsers,
	getFollowers,
	getFollowing,
} from './user/thunks'

export interface RootStore {
	readonly authStore: AuthStore
	readonly statusStore: StatusStore
	readonly userStore: UserStore
}

export type AnyStore =
	| AuthStore
	| StatusStore
	| UserStore

export type StoreActionType =
	| AuthActionType
	| StatusActionType
	| UserActionType

export const actions = {
	login,
	register,
	logout,
	cleanStatusStore,
	getStory,
	getFeed,
	getHashtag,
	getStatus,
	addStatus,
	cleanUserStore,
	getUser,
	getUsers,
	getFollowers,
	getFollowing,
}

const makeStore = (services: Services) => createStore(

	// This is what the store looks like
	combineReducers<RootStore>({
		authStore: authReducer,
		statusStore: statusReducer,
		userStore: userReducer,
	}),

	// This is the initial state
	{
		authStore: initialAuthStore,
		statusStore: initialStatusStore,
		userStore: initialUserStore,
	},

	composeWithDevTools(
		applyMiddleware(thunk.withExtraArgument(services)),
	),

)

const store = makeStore(services)

export default store
