import React from 'react'
import { Link } from 'react-router-dom'

import './style.css'

interface Props {
	viewstate: {
		alias: string
		list: string
		users: string[]
		endEl: React.RefObject<HTMLDivElement>
	}
}

const UsersView: React.FC<Props> = props => {

	const {
		alias,
		list,
		users,
		endEl,
	} = props.viewstate

	return (
		<div className='users-list'>
			<h1>{`${list === `following` ? `Who ` : ``}@${alias}${list === `followers` ? `'s` : ` is`} ${list}:`}</h1>
			{users.map(a => (
				<Link key={a} to={`/user/${a}`} className='status-alias'>
					<h3>@{a}</h3>
				</Link>
			))}
			<div ref={endEl} style={{ height: `2rem`, width: `100%` }} />
		</div>
	)
}

export default UsersView
