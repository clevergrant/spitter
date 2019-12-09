import React, { FC } from 'react'

import { User, Status } from 'app/models'

import {
	StatusViewContainer,
	SpitterContainer,
} from 'ui/containers'

import './style.css'

interface Props {
	viewstate: {
		users: User[]
		feed: Status[]
		endEl: React.RefObject<HTMLDivElement>
		showSpitter?: boolean
	}
}

const Feed: FC<Props> = props => {

	const {
		users,
		feed,
		endEl,
		showSpitter = true,
	} = props.viewstate

	return (
		<div id='feed'>

			{showSpitter && <SpitterContainer />}

			<div>
				{
					feed.map(status => {
						const user = users.find(u => u.alias === status.alias)

						return user ?
							<StatusViewContainer key={`${status.alias}${status.timestamp}`} status={status} user={user} />
							:
							null
					})
				}
				<div ref={endEl} style={{ height: `2rem`, width: `100%` }} />
			</div>

		</div>
	)
}

export default Feed
