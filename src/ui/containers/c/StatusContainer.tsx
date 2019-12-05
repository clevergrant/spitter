import React, { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { User, Status } from 'app/models'

import { RootStore } from 'app/services/store'

import { GetStatusDone, StatusCleanPayload, StatusClean } from 'app/interfaces/status'
import { GetUserDone, UserCleanPayload, UserClean } from 'app/interfaces/user'

import { StatusViewContainer } from 'ui/containers'
import services from 'app/services'

interface Props {
	user?: User
	status?: Status
	getUser: (alias: string) => Promise<GetUserDone>
	getStatus: (alias: string, timestamp: number) => Promise<GetStatusDone>
	cleanDataStore: (store: StatusCleanPayload) => Promise<StatusClean>
	cleanUserStore: (store: UserCleanPayload) => Promise<UserClean>
}

const StatusContainer: FC<Props> = props => {

	const {
		alias,
		timestamp,
	} = useParams()

	const {
		user,
		status,
		getUser,
		getStatus,
		cleanDataStore,
		cleanUserStore,
	} = props

	useEffect(() => {

		if (!alias || !timestamp) return
		else if (!status) getStatus(alias, parseInt(timestamp))
		else if (!user) getUser(status.alias)

	}, [
		status,
		getStatus,
		user,
		getUser,
		alias,
		timestamp,
	])

	useEffect(() => () => {
		cleanDataStore({
			status: true,
		})
		cleanUserStore({
			user: true,
		})
	}, [cleanDataStore, cleanUserStore, alias, timestamp])

	if (!status || !user || !alias || !timestamp) return null

	return <StatusViewContainer status={status} user={user} />
}

const mapStoreToProps = (store: RootStore) => ({
	user: store.userStore.user,
	status: store.statusStore.status,
})

const mapDispatchToProps = {
	getUser: services.userService.getUser,
	getStatus: services.statusService.getStatus,
	cleanUserStore: services.userService.cleanUserStore,
	cleanDataStore: services.statusService.cleanStatusStore,
}

export default connect(mapStoreToProps, mapDispatchToProps)(StatusContainer)
