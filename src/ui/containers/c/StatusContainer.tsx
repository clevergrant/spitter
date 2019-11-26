import React, { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { User, Status } from 'app/models'

import { actions, RootStore } from 'app/store'
import {
	// GetUserDone,
	UserCleanPayload,
	UserClean,
} from 'app/store/user/types'
import { GetStatusDone, StatusCleanPayload, StatusClean } from 'app/store/status/types'

import { StatusViewContainer } from 'ui/containers'

interface Props {
	user?: User
	status?: Status
	// getUser: (alias: string) => Promise<GetUserDone>
	getStatus: (id: string) => Promise<GetStatusDone>
	cleanDataStore: (store: StatusCleanPayload) => Promise<StatusClean>
	cleanUserStore: (store: UserCleanPayload) => Promise<UserClean>
}

const StatusContainer: FC<Props> = props => {

	const {
		id,
	} = useParams()

	const {
		user,
		status,
		// getUser,
		getStatus,
		cleanDataStore,
		cleanUserStore,
	} = props

	useEffect(() => {

		if (!id) return
		else if (!status) getStatus(id)
		// else if (!user) getUser(status.alias)

	}, [
		id,
		status,
		getStatus,
		user,
		// getUser,
	])

	useEffect(() => () => {
		cleanDataStore({
			status: true,
		})
		cleanUserStore({
			user: true,
		})
	}, [cleanDataStore, cleanUserStore, id])

	if (!id || !status || !user) return null

	return <StatusViewContainer status={status} user={user} />
}

const mapStoreToProps = (store: RootStore) => ({
	user: store.userStore.user,
	status: store.statusStore.status,
})

const mapDispatchToProps = {
	// getUser: actions.getUser,
	getStatus: actions.getStatus,
	cleanUserStore: actions.cleanUserStore,
	cleanDataStore: actions.cleanStatusStore,
}

export default connect(mapStoreToProps, mapDispatchToProps)(StatusContainer)
