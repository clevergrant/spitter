import { User, Status, Attachment } from 'app/models'

class ApiGatewayProxy {

	private ___baseUrl = `https://anz3gpj48b.execute-api.us-west-2.amazonaws.com/alpha`

	public register = (alias: string, name: string, password: string, photo: Attachment) => fetch(`${this.___baseUrl}/auth`, {
		method: `POST`,
		headers: {
			'Content-Type': `application/json`,
		},
		body: JSON.stringify({
			alias,
			name,
			password,
			photo,
		}),
	}).then(r => r.json())
		.catch(console.error)

	public getUser = (alias: string) => new Promise<User>((resolve, reject) => {
		fetch(`${this.___baseUrl}/${alias}`)
			.then(r => r.json())
			.then(json => {
				const user = new User(json.name, json.alias, json.photo)
				resolve(user)
			})
			.catch(reject)
	})

	public editUser = (user: User) => new Promise<User>((resolve, reject) => {
		fetch(`${this.___baseUrl}/${user.alias}`, {
			method: `PATCH`,
			headers: {
				'Content-Type': `application/json`,
			},
			body: JSON.stringify(user),
		}).then(r => r.json())
			.then(json => {
				const user = new User(json.name, json.alias, json.photo)
				resolve(user)
			})
			.catch(reject)
	})

	public deleteUser = (alias: string) => new Promise<string>((resolve, reject) => {
		fetch(`${this.___baseUrl}/${alias}`, {
			method: `DELETE`,
		}).then(r => r.json())
			.then(json => {
				resolve(json.message)
			})
			.catch(reject)
	})

	public getStory = (alias: string, lastId: string, numResults: number) => new Promise<Status[]>((resolve, reject) => {
		fetch(`${this.___baseUrl}/${alias}/story/${lastId}/${numResults}`)
			.then(r => r.json())
			.then(json => {
				const statuses = json.map((obj: Status) => new Status(obj.alias, obj.text, obj.attachment as Attachment))
				resolve(statuses)
			})
			.catch(reject)
	})

	public getFeed = (alias: string, lastKey: number, numResults: number) => new Promise<Status[]>((resolve, reject) => {
		fetch(`${this.___baseUrl}/${alias}/feed/${lastKey}/${numResults}`)
			.then(r => r.json())
			.then(json => {
				const statuses = json.map((obj: Status) => new Status(obj.alias, obj.text, obj.attachment as Attachment))
				resolve(statuses)
			})
			.catch(reject)
	})

	public follow = (alias: string) => new Promise<string>((resolve, reject) => {
		fetch(`${this.___baseUrl}/friends/${alias}`, {
			method: `POST`,
		}).then(r => r.json())
			.then(json => {
				resolve(json.message)
			})
			.catch(reject)
	})

	public unfollow = (alias: string) => new Promise<string>((resolve, reject) => {
		fetch(`${this.___baseUrl}/friends/${alias}`, {
			method: `DELETE`,
		}).then(r => r.json())
			.then(json => {
				resolve(json.message)
			})
			.catch(reject)
	})

	public listFollowing = (lastKey: number, numResults: number) => new Promise<User[]>((resolve, reject) => {
		fetch(`${this.___baseUrl}/friends/following/${lastKey}/${numResults}`)
			.then(r => r.json())
			.then(json => {
				const users = json.map((user: User) => new User(user.name, user.alias, user.photo as Attachment))
				resolve(users)
			})
			.catch(reject)
	})

	public listFollowers = (lastKey: number, numResults: number) => new Promise<User[]>((resolve, reject) => {
		fetch(`${this.___baseUrl}/friends/followers/${lastKey}/${numResults}`)
			.then(r => r.json())
			.then(json => {
				const users = json.map((user: User) => new User(user.name, user.alias, user.photo as Attachment))
				resolve(users)
			})
			.catch(reject)
	})

	public addStatus = (status: Status) => new Promise<string>((resolve, reject) => {
		fetch(`${this.___baseUrl}/status`, {
			method: `POST`,
			headers: {
				'Content-Type': `application/json`,
			},
			body: JSON.stringify(status),
		}).then(r => r.json())
			.then(json => {
				resolve(json.message)
			})
			.catch(reject)
	})

	public getStatus = (id: string) => new Promise<Status>((resolve, reject) => {
		fetch(`${this.___baseUrl}/status/${id}`)
			.then(r => r.json())
			.then(json => {
				const status = new Status(json.alias, json.text, json.attachment as Attachment)
				resolve(status)
			})
			.catch(reject)
	})

	public getHashtag = (hashtag: string, lastKey: number, numResults: number) => new Promise<Status[]>((resolve, reject) => {
		fetch(`${this.___baseUrl}/hashtag/${hashtag}/${lastKey}/${numResults}`)
			.then(r => r.json())
			.then(json => {
				const statuses = json.map((obj: Status) => new Status(obj.alias, obj.text, obj.attachment as Attachment))
				resolve(statuses)
			})
			.catch(reject)
	})

}

export const apiGatewayProxy = new ApiGatewayProxy()
