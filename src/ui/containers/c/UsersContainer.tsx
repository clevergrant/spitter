import React, { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { User } from 'app/models'

import { actions, RootStore } from 'app/store'
import {
	// GetUserDone,
	UserCleanPayload,
	UserClean,
	GetUserListDone,
} from 'app/store/user/types'

import { UsersView } from 'ui/components'

interface Props {
	user?: User
	userList?: string[]
	// getUser: (alias: string) => Promise<GetUserDone>
	getFollowers: (alias: string) => Promise<GetUserListDone>
	getFollowing: (alias: string) => Promise<GetUserListDone>
	cleanUserStore: (store: UserCleanPayload) => Promise<UserClean>
}

const UsersContainer: FC<Props> = props => {

	const {
		alias,
		list,
	} = useParams()

	const {
		user,
		userList,
		// getUser,
		getFollowers,
		getFollowing,
		cleanUserStore,
	} = props

	useEffect(
		() => {

			if (!alias || !list) return
			// else if (!user) getUser(alias)
			else if (!user) return
			else if (!userList) {

				switch (list) {
				case `following`:
					getFollowing(user.alias)
					break

				case `followers`:
					getFollowers(user.alias)
					break

				default:
					break
				}

			}
		},
		[
			alias,
			list,
			user,
			// getUser,
			userList,
			getFollowing,
			getFollowers,
		]
	)

	useEffect(() => () => {
		cleanUserStore({
			user: true,
			userList: true,
		})
	}, [cleanUserStore, alias, list])

	if (!alias || !list || !user || !userList) return null

	const viewstate = {
		alias,
		list,
		users: userList,
	}

	return <UsersView viewstate={viewstate} />
}

const mapStoreToProps = (store: RootStore) => ({
	user: store.userStore.user,
	userList: store.userStore.userList,
})

const mapDispatchToProps = {
	// getUser: actions.getUser,
	getFollowers: actions.getFollowers,
	getFollowing: actions.getFollowing,
	cleanUserStore: actions.cleanUserStore,
}

export default connect(mapStoreToProps, mapDispatchToProps)(UsersContainer)
