import React, { FC, useEffect, useState, ChangeEvent } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { User, Attachment, AttachmentType } from 'app/models'

import services from 'app/services'
import { RootStore } from 'app/services/store'

import { UserView } from 'ui/components'
import { UserCleanPayload, UserClean, GetUserDone, GetFollowersDone, GetFollowingCountDone, GetFollowerCountDone, CheckFollowingDone } from 'app/interfaces/user'
import { EditUserDone } from 'app/interfaces/auth'

interface Props {
	user?: User
	fetchedUser?: User
	isFollower?: boolean
	followerCount?: number
	followingCount?: number
	getUser: (alias: string) => Promise<GetUserDone>
	checkFollowing: (follower: string, followee: string) => Promise<CheckFollowingDone>
	getFollowerCount: (alias: string) => Promise<GetFollowerCountDone>
	getFollowingCount: (alias: string) => Promise<GetFollowingCountDone>
	follow: (follower: string, followee: string) => Promise<GetFollowersDone>
	unfollow: (follower: string, followee: string) => Promise<GetFollowersDone>
	cleanUserStore: (store: UserCleanPayload) => Promise<UserClean>
	editUser: (user: User) => Promise<EditUserDone>
}

const UserContainer: FC<Props> = props => {

	const {
		alias,
	} = useParams()

	const {
		user,
		fetchedUser,
		followerCount,
		followingCount,
		getUser,
		getFollowerCount,
		getFollowingCount,
		follow,
		unfollow,
		cleanUserStore,
		isFollower,
		checkFollowing,
		editUser,
	} = props

	const [self, setSelf] = useState(true)

	const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
		if (!user) return
		try {
			const list: FileList = e.target.files as FileList
			if (list.length > 0) {
				const file: File = list[0]
				const attachment = new Attachment(
					URL.createObjectURL(file),
					AttachmentType.PHOTO,
					file
				)
				editUser(new User(
					user.name,
					user.alias,
					attachment
				))
			}
		} catch (error) {
			alert(error.message)
		}
	}

	const handleFollow = (followee: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (!user) return
		follow(user.alias, followee)
	}

	const handleUnfollow = (followee: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (!user) return
		unfollow(user.alias, followee)
	}

	useEffect(
		() => {
			if (!user) return
			else if (!alias) return
			else if (!fetchedUser) {
				setSelf(alias === user.alias)
				getUser(alias)
			} else if (isFollower === undefined)
				checkFollowing(user.alias, alias)
			else if (followerCount === undefined)
				getFollowerCount(alias)
			else if (followingCount === undefined)
				getFollowingCount(alias)
		},
		[
			user,
			alias,
			fetchedUser,
			setSelf,
			getUser,
			isFollower,
			followerCount,
			followingCount,
			checkFollowing,
			getFollowerCount,
			getFollowingCount,
		]
	)

	useEffect(() => () => {
		cleanUserStore({
			user: true,
			followerCount: true,
			followingCount: true,
		})
	}, [cleanUserStore, alias])

	if (!user || !alias || !fetchedUser || isFollower === undefined || followerCount === undefined || followingCount === undefined) return null

	const viewstate = {
		user: fetchedUser,
		followerCount,
		followingCount,
		self,
		isFollower,
	}

	const handlers = {
		handlePhotoChange,
		handleFollow,
		handleUnfollow,
	}

	return <UserView viewstate={viewstate} handlers={handlers} />
}

const mapStoreToProps = (store: RootStore) => ({
	user: store.authStore.user,
	fetchedUser: store.userStore.user,
	isFollower: store.userStore.isFollower,
	followerCount: store.userStore.followerCount,
	followingCount: store.userStore.followingCount,
})

const mapDispatchToProps = {
	getUser: services.userService.getUser,
	checkFollowing: services.userService.checkFollowing,
	getFollowerCount: services.userService.getFollowerCount,
	getFollowingCount: services.userService.getFollowingCount,
	follow: services.userService.follow,
	unfollow: services.userService.unfollow,
	cleanUserStore: services.userService.cleanUserStore,
	editUser: services.authService.editUser,
}

export default connect(mapStoreToProps, mapDispatchToProps)(UserContainer)
