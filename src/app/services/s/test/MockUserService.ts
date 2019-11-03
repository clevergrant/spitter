import {
	Attachment,
	AttachmentType,
	PUser,
	User,
} from 'app/models'

import { UserService } from 'app/interfaces'

import { MockAuthService } from './MockAuthService'

import userfile from './users.json'

import grek from 'ui/assets/images/grek.jpg'

export class MockUserService implements UserService {

	private static ___instance: MockUserService

	public static getInstance() {

		if (!this.___instance){
			try {
				this.___instance = new MockUserService()
				this.___instance.___importUsers()
			} catch (error) {
				console.error(error.message)
			}
		}

		return this.___instance
	}

	private ___users: PUser[] = []

	public register = (alias: string, name: string, password: string, photo: Attachment) => new Promise<User>((resolve, reject): void => {
		setTimeout(() => {

			if (photo.attachmentType !== AttachmentType.PHOTO) reject(new Error(`Attachment must be a photo.`))

			try {

				const newUser: PUser = new PUser(name, alias, password, photo)
				this.___addUsers([newUser])

				resolve(MockAuthService.getInstance().login(newUser.alias, newUser.password))

			} catch (error) {
				reject(error)
			}

		}, 100)
	})

	public addUser = (user: PUser) => new Promise<void>((resolve, reject) => {
		try {
			this.___addUsers([user])
			resolve()
		} catch (error) {
			reject(error)
		}
	})

	public getUser = (alias: string) => new Promise<User>((resolve, reject): void => {
		try {
			const user = this.___users.find(user => user.alias === alias) as User
			resolve(user)
		} catch (error) {
			reject(error)
		}
	})

	public getUsers = (aliases: string[], lastId: string, numResults: number) => new Promise<User[]>((resolve, reject): void => {
		try {
			const users = aliases.map(alias => this.___users.find(user => user.alias === alias) as User)

			if (lastId === ``) resolve(users.slice(0, numResults))
			else {
				const lastIndex = users.findIndex(user => user.id === lastId) + 1
				const nextUsers = users.slice(lastIndex, lastIndex + numResults)
				resolve(nextUsers)
			}

		} catch (error) {
			reject(error)
		}
	})

	public getFollowers = (alias: string, lastId: string, numResults: number) => new Promise<User[]>((resolve, reject): void => {
		try {
			const users: User[] = this.___users.filter(user => user.following.includes(alias))

			if (lastId === ``) resolve(users.slice(0, numResults))
			else {
				const lastIndex = users.findIndex(user => user.id === lastId) + 1
				const nextUsers = users.slice(lastIndex, lastIndex + numResults)
				resolve(nextUsers)
			}

		} catch (error) {
			reject(error)
		}
	})

	public getFollowing = (alias: string, lastId: string, numResults: number) => new Promise<User[]>((resolve, reject): void => {
		try {
			const user = this.___users.find(u => u.alias === alias) as User
			const users = user.following.map(a => this.___users.find(u => u.alias === a) as User)

			if (lastId === ``) resolve(users.slice(0, numResults))
			else {
				const lastIndex = users.findIndex(user => user.id === lastId) + 1
				const nextUsers = users.slice(lastIndex, lastIndex + numResults)
				resolve(nextUsers)
			}

		} catch (error) {
			reject(error)
		}
	})

	private ___importUsers = () => {

		this.___users = userfile.map(user => {

			user.photo.attachmentType = AttachmentType.PHOTO
			if (!user.photo.src) user.photo.src = grek

			const puser = new PUser(user.name, user.alias, user.password, user.photo as Attachment)
			puser.id = user.id
			puser.followers = user.followers
			puser.following = user.following

			return puser
		})

		this.___setUsers()
	}

	private ___addUsers = (users: PUser[]) => {
		if (users.length) return this.___users.push(...users)
		return this.___users.length
	}

	private ___setUsers = (users?: PUser[]) => {
		if (users) this.___users = users
	}

}
