import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import proxies from 'app/proxy'
import services from 'app/services'

import { AuthStore } from 'app/interfaces/auth'
import { StatusStore } from 'app/interfaces/status'
import { UserStore } from 'app/interfaces/user'

export interface RootStore {
	readonly authStore: AuthStore
	readonly statusStore: StatusStore
	readonly userStore: UserStore
}

const composeEnhancers = composeWithDevTools({
	trace: true,
})

const store = createStore(

	// This is what the store looks like
	combineReducers<RootStore>({
		authStore: services.authService.reducer,
		statusStore: services.statusService.reducer,
		userStore: services.userService.reducer,
	}),

	// This is the initial state
	{
		authStore: services.authService.store,
		statusStore: services.statusService.store,
		userStore: services.userService.store,
	},

	composeEnhancers(
		applyMiddleware(thunk.withExtraArgument(proxies)),
	),

)

export default store
