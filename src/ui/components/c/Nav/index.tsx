import React, { FC } from 'react'
import { Link } from 'react-router-dom'

import { User } from 'app/models'

import { ImageCircle, Logo } from 'ui/components'

import logo from 'ui/assets/images/logo.svg'

import './style.css'

interface Props {
	user?: User
	handlers: {
		handleLogout: () => void
	}
}

const Nav: FC<Props> = props => {

	const {
		user,
		handlers,
	} = props

	return (
		<nav>

			<div className='right'>
				<Link to='/'><Logo text='Spitter' src={logo} /></Link>
			</div>

			<div className='left'>

				{user &&
					<button onClick={handlers.handleLogout}>Log Out</button>
				}

				{user &&
					<Link to={`/user/${user.alias}`}>
						<ImageCircle dataUrl={user.photo.src} alt={user.alias} />
					</Link>
				}

			</div>

		</nav>
	)
}

export default Nav
