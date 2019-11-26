import {
	AuthService,
} from 'app/interfaces'

import {
	PUser,
	User,
	Attachment,
} from 'app/models'

export class MockAuthService implements AuthService {

	private static ___instance: MockAuthService

	public static getInstance() {

		if (!this.___instance) {
			try {
				const inst = this.___instance = new MockAuthService()
				inst.___importCurrentUser()
			} catch (error) {
				console.error(error.message)
			}
		}

		return this.___instance
	}

	private ___currentUser?: PUser

	public register = (name: string, alias: string, password: string, photo: Attachment) => new Promise<User>((resolve, reject) => {

	})

	public login = (alias?: string, password?: string) => new Promise<User>((resolve, reject) => {
		setTimeout(async () => {
			if (this.___currentUser) resolve(this.___currentUser as User)
		}, 100)
	})

	public logout = () => new Promise<void>((resolve, reject): void => {
		setTimeout(() => {
			try {
				delete this.___currentUser
				sessionStorage.removeItem(`user`)
				resolve()
			} catch (error) {
				reject(error)
			}
		}, 100)
	})

	public check = () => new Promise<User>((resolve, reject) => {
		try {
			resolve(this.___currentUser)
		} catch (error) {
			reject(error)
		}
	})

	public getUser = () => new Promise<User>((res, rej) => {
		res()
	})
	public getUsers = () => new Promise<User[]>((res, rej) => {
		res()
	})

	private ___importCurrentUser = () => {
		const alias = sessionStorage.getItem(`user`)
	}

	private ___setCurrentUser = (user?: PUser): void => {
		if (!user) delete this.___currentUser
		else {
			this.___currentUser = user
			sessionStorage.setItem(`user`, user.alias)
		}
	}
}
