import React, { FC, useEffect, useRef } from 'react'
import { throttle } from 'lodash'
import { elementTopInView } from 'lib/util'
import { connect } from 'react-redux'

import { Status, User } from 'app/models'

import { actions, RootStore } from 'app/store'
import { GetFeedDone, StatusCleanPayload, StatusClean } from 'app/store/status/types'
import {
	GetUsersDone,
	UserCleanPayload,
	UserClean,
} from 'app/store/user/types'

import { Feed } from 'ui/components'

interface Props {
	user?: User
	users?: User[]
	feed?: Status[]
	loading: boolean
	getFeed: (alias: string) => Promise<GetFeedDone>
	getUsers: (aliases: string[]) => Promise<GetUsersDone>
	cleanDataStore: (store: StatusCleanPayload) => Promise<StatusClean>
	cleanUserStore: (store: UserCleanPayload) => Promise<UserClean>
}

const FeedContainer: FC<Props> = props => {

	const {
		user,
		users,
		feed,
		loading,
		getFeed,
		getUsers,
		cleanDataStore,
		cleanUserStore,
	} = props

	const endEl = useRef<HTMLDivElement>(null)

	window.onscroll = throttle(() => {
		if (user && endEl.current && elementTopInView(endEl.current) && !loading)
			getFeed(user.alias)
	}, 1000, { leading: true })

	useEffect(
		() => {
			if (!user) return
			else if (!feed) getFeed(user.alias)
			else {
				const usersNeeded = feed.reduce((acc: string[], status: Status) => {
					if (!acc.find(alias => alias === status.alias))
						acc.push(status.alias)
					return acc
				}, [])

				if (!users) getUsers(usersNeeded)
				else {
					const usersChanged = JSON.stringify(users.map(user => user.alias)) !== JSON.stringify(usersNeeded)
					if (usersChanged) getUsers(usersNeeded)
					else if (endEl.current && elementTopInView(endEl.current))
						getFeed(user.alias)
				}
			}
		},
		[
			user,
			feed,
			getFeed,
			users,
			getUsers,
		],
	)

	useEffect(() => () => {
		cleanDataStore({
			feed: true,
		})
		cleanUserStore({
			users: true,
		})
	}, [cleanDataStore, cleanUserStore])

	if (!user || !users || !feed) return null

	const viewstate = {
		feed,
		users,
		endEl,
	}

	return <Feed viewstate={viewstate} />
}

const mapStoreToProps = (store: RootStore) => ({
	user: store.authStore.user,
	users: store.userStore.users,
	feed: store.statusStore.feed,
	loading: store.statusStore.loading,
})

const mapDispatchToProps = {
	getFeed: actions.getFeed,
	getUsers: actions.getUsers,
	cleanUserStore: actions.cleanUserStore,
	cleanDataStore: actions.cleanStatusStore,
}

export default connect(mapStoreToProps, mapDispatchToProps)(FeedContainer)
