import React, { FC } from 'react'

import { Status, User } from 'app/models'

import { StatusViewContainer } from 'ui/containers'

import './style.css'

interface Props {
	viewstate: {
		hashtag: string
		hashtags: Status[]
		users: User[] | null
	}
}

const Hashtag: FC<Props> = props => {

	const {
		hashtag,
		hashtags,
		users,
	} = props.viewstate

	if (!users) return null

	return (
		<div className='hashtag-view'>
			<h1>#{hashtag}</h1>
			{
				hashtags.map(status => {
					const user = users.find(u => u.alias === status.alias)
					return user ? <StatusViewContainer key={`${status.alias}${status.timestamp}`} status={status} user={user} /> : null
				})
			}
		</div>
	)
}

export default Hashtag
