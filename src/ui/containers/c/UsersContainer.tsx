import React, { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { User } from 'app/models'

import services from 'app/services'
import { RootStore } from 'app/services/store'

import { GetUserDone, GetFollowersDone, UserCleanPayload, UserClean, GetFollowingDone } from 'app/interfaces/user'

import { UsersView } from 'ui/components'

interface Props {
	user?: User
	followers?: string[]
	following?: string[]
	getUser: (alias: string) => Promise<GetUserDone>
	getFollowers: (alias: string) => Promise<GetFollowersDone>
	getFollowing: (alias: string) => Promise<GetFollowingDone>
	cleanUserStore: (store: UserCleanPayload) => Promise<UserClean>
}

const UsersContainer: FC<Props> = props => {

	const {
		alias,
		list,
	} = useParams()

	const {
		user,
		followers,
		following,
		getUser,
		getFollowers,
		getFollowing,
		cleanUserStore,
	} = props

	const [users, setUsers] = useState()

	useEffect(
		() => {
			if (!alias || !list) return
			else if (!user) getUser(alias)
			else if (list === `followers`) {
				if (!followers) getFollowers(user.alias)
				else setUsers(followers)
			} else if (list === `following`) {
				if (!following) getFollowing(user.alias)
				else setUsers(following)
			}
		},
		[
			alias,
			list,
			user,
			getUser,
			followers,
			following,
			getFollowing,
			getFollowers,
		]
	)

	useEffect(() => () => {
		cleanUserStore({
			user: true,
			followers: true,
			following: true,
		})
	}, [cleanUserStore, alias, list])

	if (!alias || !list || !user || !users) return null

	const viewstate = {
		alias,
		list,
		users,
	}

	return <UsersView viewstate={viewstate} />
}

const mapStoreToProps = (store: RootStore) => ({
	user: store.userStore.user,
	followers: store.userStore.followers,
	following: store.userStore.following,
})

const mapDispatchToProps = {
	getUser: services.userService.getUser,
	getFollowers: services.userService.getFollowers,
	getFollowing: services.userService.getFollowing,
	cleanUserStore: services.userService.cleanUserStore,
}

export default connect(mapStoreToProps, mapDispatchToProps)(UsersContainer)
