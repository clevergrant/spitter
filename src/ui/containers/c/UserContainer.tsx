import React, { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { User } from 'app/models'

import { actions, RootStore } from 'app/store'
import {
	// GetUserDone,
	UserCleanPayload,
	UserClean,
} from 'app/store/user/types'

import { UserView } from 'ui/components'

interface Props {
	user?: User
	fetchedUser?: User
	// getUser: (alias: string) => Promise<GetUserDone>
	cleanUserStore: (store: UserCleanPayload) => Promise<UserClean>
}

const UserContainer: FC<Props> = props => {

	const {
		alias,
	} = useParams()

	const {
		user,
		fetchedUser,
		// getUser,
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
				console.log()
				// getUser(alias)
			}
		},
		[
			user,
			alias,
			fetchedUser,
			// getUser,
			setSelf,
		]
	)

	useEffect(() => () => {
		cleanUserStore({
			user: true,
		})
	}, [cleanUserStore, alias])

	if (!user || !alias || !fetchedUser) return null

	const viewstate = {
		user: fetchedUser,
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
})

const mapDispatchToProps = {
	// getUser: actions.getUser,
	cleanUserStore: actions.cleanUserStore,
}

export default connect(mapStoreToProps, mapDispatchToProps)(UserContainer)
