import React, { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { Status, User } from 'app/models'

import { GetHashtagDone, StatusClean, StatusCleanPayload } from 'app/interfaces/status'
import { GetUsersDone, UserClean, UserCleanPayload } from 'app/interfaces/user'

import services from 'app/services'
import { RootStore } from 'app/services/store'

import { Hashtag } from 'ui/components'

interface Props {
	users?: User[]
	hashtags?: Status[]
	getUsers: (aliases: string[]) => Promise<GetUsersDone>
	getHashtag: (hashtag: string) => Promise<GetHashtagDone>
	cleanDataStore: (store: StatusCleanPayload) => Promise<StatusClean>
	cleanUserStore: (store: UserCleanPayload) => Promise<UserClean>
}

const HashtagViewContainer: FC<Props> = props => {

	const {
		hashtag,
	} = useParams()

	const {
		users,
		hashtags,
		getUsers,
		getHashtag,
		cleanDataStore,
		cleanUserStore,
	} = props

	useEffect(
		() => {
			if (!hashtag) return
			else if (!hashtags) getHashtag(hashtag)
			else if (!users) {

				const usersNeeded = hashtags.reduce((acc: string[], status: Status) => {
					if (!acc.find(alias => alias === status.alias))
						acc.push(status.alias)
					return acc
				}, [])

				getUsers(usersNeeded)
			}
		},
		[
			hashtag,
			users,
			hashtags,
			getUsers,
			getHashtag,
		]
	)

	useEffect(() => () => {
		cleanDataStore({
			hashtags: true,
		})
		cleanUserStore({
			users: true,
		})
	}, [cleanDataStore, cleanUserStore, hashtag])

	if (!hashtag || !hashtags || !users) return null

	const viewstate = {
		hashtag,
		hashtags,
		users,
	}

	return <Hashtag viewstate={viewstate} />
}

const mapStoreToProps = (store: RootStore) => ({
	hashtags: store.statusStore.hashtags,
	users: store.userStore.users,
})

const mapDispatchToProps = {
	getHashtag: services.statusService.getHashtags,
	cleanDataStore: services.statusService.cleanStatusStore,
	getUsers: services.userService.getUsers,
	cleanUserStore: services.userService.cleanUserStore,
}

export default connect(mapStoreToProps, mapDispatchToProps)(HashtagViewContainer)
