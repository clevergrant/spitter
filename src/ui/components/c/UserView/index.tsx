import React, { FC, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'

import { User } from 'app/models'

import { StoryContainer } from 'ui/containers'
import { ImageCircle } from 'ui/components'

import './style.css'

interface Props {
	viewstate: {
		user: User
		followerCount: number
		followingCount: number
		self?: boolean
		isFollower: boolean
	}
	handlers: {
		handlePhotoChange?: (e: ChangeEvent<HTMLInputElement>) => void
		handleFollow: (followee: string) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
		handleUnfollow: (followee: string) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
	}
}

const UserView: FC<Props> = props => {

	const {
		user,
		followerCount,
		followingCount,
		self,
		isFollower,
	} = props.viewstate

	const {
		handlePhotoChange,
		handleFollow,
		handleUnfollow,
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
						<Link to={`/user/${user.alias}/following`}><span>{followingCount}</span> Following</Link>
						<Link to={`/user/${user.alias}/followers`}><span>{followerCount}</span> Followers</Link>
					</p>

				</div>

				{!self &&
					<div className='follow-button-container'>
						{
							isFollower ?
								<button onClick={handleUnfollow(user.alias)}>unfollow</button>
								:
								<button onClick={handleFollow(user.alias)}>follow</button>
						}
					</div>
				}

			</div>

			<StoryContainer user={user} />
		</>
	)
}

export default UserView
