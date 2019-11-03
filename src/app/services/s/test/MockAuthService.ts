import {
	AuthService,
} from 'app/interfaces'

import {
	PUser,
	User,
} from 'app/models'

import { MockUserService } from './MockUserService'

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

	public login = (alias?: string, password?: string) => new Promise<User>((resolve, reject) => {
		setTimeout(async () => {
			if (this.___currentUser) resolve(this.___currentUser as User)
			else if(alias && password) {
				MockUserService.getInstance().getUser(alias)
					.then(user => {
						const puser = user as PUser
						if (puser.password === password) {
							this.___setCurrentUser(puser)
							resolve(user)
						} else reject(new Error(`Password incorrect.`))
					})
					.catch(reject)
			} else reject(new Error(`Nobody is logged in.`))
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

	private ___importCurrentUser = () => {
		const alias = sessionStorage.getItem(`user`)
		if (alias) {
			MockUserService.getInstance().getUser(alias)
				.then(u => {
					const puser = u as PUser
					this.___currentUser = puser
				})
				.catch((error: Error) => {
					throw error
				})
		}
	}

	private ___setCurrentUser = (user?: PUser): void => {
		if (!user) delete this.___currentUser
		else {
			this.___currentUser = user
			sessionStorage.setItem(`user`, user.alias)
		}
	}
}
