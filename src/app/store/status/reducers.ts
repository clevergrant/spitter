import { Reducer } from 'redux'

import { StatusActionType, StatusTypes } from './types'
import StatusStore, { initialStatusStore } from './stores'

const statusReducer: Reducer<StatusStore, StatusActionType> = (
	store = initialStatusStore,
	action,
) => {
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

export default statusReducer
