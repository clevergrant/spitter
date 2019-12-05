import React, { FC, MouseEvent } from 'react'
import { Link } from 'react-router-dom'

import { User, Status } from 'app/models'

import { ImageCircle, AttachmentView } from 'ui/components'

import './style.css'

interface Props {
	viewstate: {
		status: Status
		user: User
		date: string
		linkedStatusText: any[]
	}
	handlers: {
		handleStatusClick: (alias: string, timestamp: number) => (e: MouseEvent) => void
	}
}

const StatusView: FC<Props> = props => {

	const {
		status,
		user,
		date,
		linkedStatusText: linkedStatus,
	} = props.viewstate

	const {
		handleStatusClick,
	} = props.handlers

	return (
		<div className='status'>
			<ImageCircle dataUrl={user.photo.src} alt={user.alias} />

			<div className='inner'>

				<Link to={`/user/${user.alias}`} className='status-alias'>
					<b>{user.name}</b>
					<span>@{user.alias}</span>
				</Link>

				<span className='middot'>&middot;</span>

				<small>{date}</small>

				<p className='p-link' onClick={handleStatusClick(status.alias, status.timestamp)}>{linkedStatus}</p>

				{status.attachment && <AttachmentView attachment={status.attachment} />}
			</div>
		</div>
	)
}

export default StatusView
