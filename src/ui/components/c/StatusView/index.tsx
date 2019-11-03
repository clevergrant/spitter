import React, { FC, MouseEvent } from 'react'
import { Link } from 'react-router-dom'

import { User, Attachment } from 'app/models'

import { ImageCircle, AttachmentView } from 'ui/components'

import './style.css'

interface Props {
	viewstate: {
		id: string
		user: User
		date: string
		linkedStatus: any[]
		attachment?: Attachment
	}
	handlers: {
		handleStatusClick: (to: string) => (e: MouseEvent) => void
	}
}

const StatusView: FC<Props> = props => {

	const {
		id,
		user,
		date,
		linkedStatus,
		attachment,
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

				<p className='p-link' onClick={handleStatusClick(id)}>{linkedStatus}</p>

				{attachment && <AttachmentView attachment={attachment} />}
			</div>
		</div>
	)
}

export default StatusView
