import React, { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { User } from 'app/models'

import services from 'app/services'
import { RootStore } from 'app/services/store'

import { UserView } from 'ui/components'
import { UserCleanPayload, UserClean, GetUserDone, GetFollowersDone, GetFollowingDone } from 'app/interfaces/user'

interface Props {
	user?: User
	fetchedUser?: User
	followers?: string[]
	following?: string[]
	getUser: (alias: string) => Promise<GetUserDone>
	getFollowers: (alias: string) => Promise<GetFollowersDone>
	getFollowing: (alias: string) => Promise<GetFollowingDone>
	cleanUserStore: (store: UserCleanPayload) => Promise<UserClean>
}

const UserContainer: FC<Props> = props => {

	const {
		alias,
	} = useParams()

	const {
		user,
		fetchedUser,
		followers = [],
		following = [],
		getUser,
		getFollowers,
		getFollowing,
		cleanUserStore,
	} = props

	const [self, setSelf] = useState(true)
	const [photo, setPhoto] = useState()

	const handlePhotoChange = () => {
		setPhoto(``)
	}

	useEffect(
		() => {
			if (!user) return
			else if (!alias) return
			else if (!fetchedUser) {
				setSelf(alias === user.alias)
				getUser(alias)
				getFollowers(alias)
				getFollowing(alias)
			}
		},
		[
			user,
			alias,
			fetchedUser,
			setSelf,
			getUser,
			getFollowers,
			getFollowing,
		]
	)

	useEffect(() => () => {
		cleanUserStore({
			user: true,
			followers: true,
			following: true,
		})
	}, [cleanUserStore, alias])

	if (!user || !alias || !fetchedUser) return null

	const viewstate = {
		user: fetchedUser,
		followers,
		following,
		photo,
		self,
	}

	const handlers = {
		handlePhotoChange,
	}

	return <UserView viewstate={viewstate} handlers={handlers} />
}

const mapStoreToProps = (store: RootStore) => ({
	user: store.authStore.user,
	fetchedUser: store.userStore.user,
	followers: store.userStore.followers,
	following: store.userStore.following,
})

const mapDispatchToProps = {
	getUser: services.userService.getUser,
	getFollowers: services.userService.getFollowers,
	getFollowing: services.userService.getFollowing,
	cleanUserStore: services.userService.cleanUserStore,
}

export default connect(mapStoreToProps, mapDispatchToProps)(UserContainer)
