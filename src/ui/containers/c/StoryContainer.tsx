import React, { FC, useEffect, useRef } from 'react'
import { throttle } from 'lodash'
import { elementTopInView } from 'lib/util'
import { connect } from 'react-redux'

import { Status, User } from 'app/models'

import { RootStore } from 'app/services/store'

import { GetStoryDone, StatusCleanPayload, StatusClean } from 'app/interfaces/status'

import { Feed } from 'ui/components'
import services from 'app/services'

interface Props {
	user: User
	story?: Status[]
	loading: boolean
	getStory: (alias: string) => Promise<GetStoryDone>
	cleanDataStore: (store: StatusCleanPayload) => Promise<StatusClean>
}

const StoryContainer: FC<Props> = props => {

	const {
		user,
		story,
		loading,
		getStory,
		cleanDataStore,
	} = props

	const endEl = useRef<HTMLDivElement>(null)

	window.onscroll = throttle(() => {
		if (endEl.current && elementTopInView(endEl.current) && !loading)
			getStory(user.alias)
	}, 250)

	useEffect(
		() => {
			if (!user) return
			else if (!story) getStory(user.alias)

			if (endEl.current && elementTopInView(endEl.current))
				getStory(user.alias)
		},
		[user, story, getStory],
	)

	useEffect(() => () => {
		cleanDataStore({
			story: true,
		})
	}, [cleanDataStore])

	if (!user || !story) return null

	const viewstate = {
		feed: story,
		users: [user],
		endEl,
		showSpitter: false,
	}

	return <Feed viewstate={viewstate} />
}

const mapStoreToProps = (store: RootStore) => ({
	story: store.statusStore.story,
	loading: store.statusStore.loading,
})

const mapDispatchToProps = {
	getStory: services.statusService.getStory,
	cleanDataStore: services.statusService.cleanStatusStore,
}

export default connect(mapStoreToProps, mapDispatchToProps)(StoryContainer)
