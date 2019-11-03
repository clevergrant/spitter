import React, { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { Status, User } from 'app/models'

import { actions, RootStore } from 'app/store'
import { GetHashtagDone, StatusCleanPayload, StatusClean } from 'app/store/status/types'
import { GetUsersDone, UserCleanPayload, UserClean } from 'app/store/user/types'

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

				const usersneeded = hashtags.reduce((acc: string[], status: Status) => {
					if (!acc.find(alias => alias === status.alias))
						acc.push(status.alias)
					return acc
				}, [])

				getUsers(usersneeded)
			}
		},
		[hashtag, users, hashtags, getUsers, getHashtag]
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
	getHashtag: actions.getHashtag,
	getUsers: actions.getUsers,
	cleanUserStore: actions.cleanUserStore,
	cleanDataStore: actions.cleanStatusStore,
}

export default connect(mapStoreToProps, mapDispatchToProps)(HashtagViewContainer)
