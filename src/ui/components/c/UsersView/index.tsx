import React from 'react'
import { Link } from 'react-router-dom'

import { User } from 'app/models'

import { ImageCircle } from 'ui/components'

import './style.css'

interface Props {
	viewstate: {
		alias: string
		list: string
		users: User[]
	}
}

const UsersView: React.FC<Props> = props => {

	const {
		alias,
		list,
		users,
	} = props.viewstate

	if (!alias || !list || !users || !users.length) return null

	return (
		<div className='users-list'>
			<h1>{`${list === `following` ? `Who ` : ``}@${alias}${list === `followers` ? `'s` : ` is`} ${list}:`}</h1>
			{users.map(user => (

				<div className='profile' key={user.id}>

					<ImageCircle dataUrl={user.photo.src} size={3} />

					<div className='details'>
						<h2>{user.name}</h2>
						<p>@{user.alias}</p>
						<p className='follow'>
							<Link to={`/user/${user.alias}/following`}><span>{user.following.length}</span> Following</Link>
							<Link to={`/user/${user.alias}/followers`}><span>{user.followers.length}</span> Followers</Link>
						</p>
					</div>
				</div>
			))}
		</div>
	)
}

export default UsersView
