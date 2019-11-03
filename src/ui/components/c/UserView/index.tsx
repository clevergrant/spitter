import React, { FC } from 'react'
import { Link } from 'react-router-dom'

import { User, Attachment } from 'app/models'

import { StoryContainer } from 'ui/containers'
import { ImageCircle } from 'ui/components'

import './style.css'

interface Props {
	viewstate: {
		user: User
		photo?: Attachment
		self?: boolean
	}
	handlers: {
		handlePhotoChange?: () => void
	}
}

const UserView: FC<Props> = props => {

	const {
		user,
		self,
	} = props.viewstate

	const {
		handlePhotoChange,
	} = props.handlers

	return (
		<>
			<div className='profile'>

				<ImageCircle dataUrl={user.photo.src} size={3} />

				{self && handlePhotoChange &&
					<form className='form-change-photo' >
						<label className='input-change-photo' htmlFor='input-change-photo'>
							<div className='image-circle-overlay'>
								<span className='mi mi-edit' />
							</div>
							<input type='file' id='input-change-photo' onChange={handlePhotoChange} hidden />
						</label>
					</form>
				}

				<div className='details'>
					<h2>{user.name}</h2>
					<p>@{user.alias}</p>

					<p className='follow'>
						<Link to={`/user/${user.alias}/following`}><span>{user.following.length}</span> Following</Link>
						<Link to={`/user/${user.alias}/followers`}><span>{user.followers.length}</span> Followers</Link>
					</p>

				</div>
			</div>

			<StoryContainer user={user} />
		</>
	)
}

export default UserView
