import React, { FC, useEffect } from 'react'
import { connect } from 'react-redux'

import { User } from 'app/models'

import services from 'app/services'
import { RootStore } from 'app/services/store'

import { LoginDone, LogoutDone } from 'app/interfaces/auth'

import { Root } from 'ui/components'

interface Props {
	user?: User
	loading: boolean
	check: () => Promise<LoginDone>
	logout: (global: boolean) => Promise<LogoutDone>
}

const RootContainer: FC<Props> = props => {

	// Viewstate

	const {
		user,
		loading,
		check,
		logout,
	} = props

	useEffect(
		() => {
			if (!user) check()
		},
		[user, check]
	)

	// Handlers

	const handleLogout = () => {
		logout(true)
	}

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
	check: services.authService.check,
	login: services.authService.login,
	logout: services.authService.logout,
}

export default connect(mapStoreToProps, mapDispatchToProps)(RootContainer)
