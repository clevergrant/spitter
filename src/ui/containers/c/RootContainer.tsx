import React, { FC, useEffect } from 'react'
import { connect } from 'react-redux'

import { User } from 'app/models'

import { actions, RootStore } from 'app/store'
import { LoginDone, LogoutDone } from 'app/store/auth/types'

import { Root } from 'ui/components'

interface Props {
	user?: User
	loading: boolean
	login: (alias?: string | undefined, password?: string | undefined) => Promise<LoginDone>
	logout: () => Promise<LogoutDone>
}

const RootContainer: FC<Props> = props => {

	// Viewstate

	const {
		user,
		loading,
		login,
		logout,
	} = props

	useEffect(
		() => {
			if (!user) login()
		},
		[user, login]
	)

	// Handlers

	const handleLogout = logout

	// View

	const viewstate = {
		user,
		loading,
	}

	const handlers = {
		handleLogout,
	}

	return <Root viewstate={viewstate} handlers={handlers} />
}

const mapStoreToProps = (store: RootStore) => ({
	user: store.authStore.user,
	loading: store.authStore.loading, // || store.statusStore.loading || store.userStore.loading,
})

const mapDispatchToProps = {
	login: actions.login,
	logout: actions.logout,
}

export default connect(mapStoreToProps, mapDispatchToProps)(RootContainer)
