import { Auth, Storage } from 'aws-amplify'
import { User, Attachment, AttachmentType, Status } from 'app/models'

export default class AwsProxy {

	private ___baseUrl = `https://42l3t7qs2l.execute-api.us-west-2.amazonaws.com/v1`

	login = async (alias: string, password: string) => {
		const { username, attributes } = await Auth.signIn(alias, password)
		const imgSrc = await Storage.get(attributes.picture) as string
		return new User(attributes.name, username, new Attachment(imgSrc, AttachmentType.PHOTO))
	}

	register = async (name: string, alias: string, password: string, photo: Attachment) => {

		if (!photo.file) throw new Error(`You didn't select a picture somehow`)

		const key = `${alias}_${photo.file.name}`

		await Storage.put(key, photo.file, {
			type: photo.file.type,
		})

		await Auth.signUp({
			username: alias,
			password,
			attributes: {
				name,
				picture: key,
			},
		})
	}

	logout = (global: boolean) => Auth.signOut({ global })

	check = async () => {
		const { username, attributes } = await Auth.currentAuthenticatedUser()
		const imgSrc = await Storage.get(attributes.picture) as string
		return new User(attributes.name, username, new Attachment(imgSrc, AttachmentType.PHOTO))
	}

	getAllUsers = async () => {

		return [] as User[]
	}

	public getStory = (alias: string, lastId: string, numResults: number) => new Promise<Status[]>((resolve, reject) => {
		fetch(`${this.___baseUrl}/${alias}/story/${lastId === `` ? -1 : lastId}/${numResults}`).then(r => r.json())
			.then(json => {
				const {
					statuses,
				} = json
				const typedStatuses = statuses.map((obj: Status) => {
					const newStatus = new Status(obj.alias, obj.text, obj.attachment as Attachment)
					newStatus.id = obj.id
					newStatus.timestamp = obj.timestamp
					return newStatus
				})
				resolve(typedStatuses)
			})
			.catch(reject)
	})

	public getFeed = (alias: string, lastId: string, numResults: number) => new Promise<Status[]>((resolve, reject) => {
		fetch(`${this.___baseUrl}/${alias}/feed/${lastId === `` ? -1 : lastId}/${numResults}`)
			.then(r => r.json())
			.then(json => {
				const {
					statuses,
				} = json
				const typedStatuses = statuses.map((obj: Status) => {
					const newStatus = new Status(obj.alias, obj.text, obj.attachment as Attachment)
					newStatus.id = obj.id
					newStatus.timestamp = obj.timestamp
					return newStatus
				})
				resolve(typedStatuses)
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

	public listFollowing = (alias: string, lastId: string, numResults: number) => new Promise<string[]>((resolve, reject) => {
		fetch(`${this.___baseUrl}/${alias}/following/${lastId === `` ? -1 : lastId}/${numResults}`).then(r => r.json())
			.then(json => {
				resolve(json.users.map((u: { alias: any }) => u.alias))
			})
			.catch(reject)
	})

	public listFollowers = (alias: string, lastId: string, numResults: number) => new Promise<string[]>((resolve, reject) => {
		fetch(`${this.___baseUrl}/${alias}/followers/${lastId === `` ? -1 : lastId}/${numResults}`).then(r => r.json())
			.then(json => {
				resolve(json.users.map((u: { alias: any }) => u.alias))
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
		fetch(`${this.___baseUrl}/status/${id}`).then(r => r.json())
			.then(json => {
				const {
					status,
				} = json
				const typedStatus = new Status(status.alias, status.text, status.attachment as Attachment)
				typedStatus.id = status.id
				typedStatus.timestamp = status.timestamp
				resolve(typedStatus)
			})
			.catch(reject)
	})

	public getHashtags = (hashtag: string, lastId: string, numResults: number) => new Promise<Status[]>((resolve, reject) => {
		fetch(`${this.___baseUrl}/status/hashtag/${hashtag}/${lastId === `` ? -1 : lastId}/${numResults}`).then(r => r.json())
			.then(json => {
				const {
					statuses,
				} = json
				const typedStatuses = statuses.map((obj: Status) => {
					const newStatus = new Status(obj.alias, obj.text, obj.attachment as Attachment)
					newStatus.id = obj.id
					newStatus.timestamp = obj.timestamp
					return newStatus
				})
				resolve(typedStatuses)
			})
			.catch(reject)
	})

	public getUser = async (alias: string) => {
		return new User(``, alias, new Attachment(``, AttachmentType.PHOTO))
	}
}
