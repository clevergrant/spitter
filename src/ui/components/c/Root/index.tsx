import React, { FC } from 'react'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import { User } from 'app/models'

import {
	FeedContainer,
	HashtagContainer,
	LoginContainer,
	StatusContainer,
	UserContainer,
	UsersContainer,
} from 'ui/containers'

import { Nav, ErrorView } from 'ui/components'

import 'material-icons/css/material-icons.css'
import 'normalize.css'
import './style-global.css'
import './style.css'

interface Props {
	viewstate: {
		user?: User
		loading: boolean
	}
	handlers: {
		handleLogout: () => void
	}
}

const Root: FC<Props> = props => {

	const {
		user,
		loading,
	} = props.viewstate

	return (
		<Router>
			<Nav user={user} handlers={props.handlers} />

			{
				loading ?
					<p>loading...</p>
					:
					<main>
						{user ?
							<Switch>

								<Route exact path='/'>
									<FeedContainer />
								</Route>

								<Route path='/user/:alias/:list'>
									<UsersContainer />
								</Route>

								<Route path='/user/:alias'>
									<UserContainer />
								</Route>

								<Route path='/hashtag/:hashtag'>
									<HashtagContainer />
								</Route>

								<Route path='/status/:id'>
									<StatusContainer />
								</Route>

								<Route>
									<ErrorView />
								</Route>

							</Switch>
							:
							<LoginContainer />
						}
					</main>
			}
		</Router>
	)
}

export default Root
