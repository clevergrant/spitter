import { Auth, Storage } from 'aws-amplify'
import { User, Attachment, AttachmentType, Status } from 'app/models'

export default class AwsProxy {

	private ___baseUrl = `https://42l3t7qs2l.execute-api.us-west-2.amazonaws.com/v1`

	public login = async (alias: string, password: string) => {
		const { username, attributes } = await Auth.signIn(alias, password)
		const imgSrc = await Storage.get(attributes.picture) as string
		return new User(attributes.name, username, new Attachment(imgSrc, AttachmentType.PHOTO))
	}

	public register = async (name: string, alias: string, password: string, photo: Attachment) => {

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
		}).then(() => {
			this.___post(`${this.___baseUrl}/user`, new User(name, alias, photo))
		})

		return this.login(alias, password)
	}

	public logout = (global: boolean) => Auth.signOut({ global })

	public check = async () => {
		const { username, attributes } = await Auth.currentAuthenticatedUser()
		const user = await this.___get<User>(`${this.___baseUrl}/${username}`)
		const src = await Storage.get(user.photo.src) as string
		return new User(attributes.name, username, new Attachment(src, AttachmentType.PHOTO))
	}

	public editUser = async (user: User) =>
		this.___patch<User, User>(`${this.___baseUrl}/${user.alias}`, user)
			.then(u => new User(u.name, u.alias, new Attachment(u.photo.src, AttachmentType.PHOTO)))

	public getUser = async (alias: string) =>
		this.___get<User>(`${this.___baseUrl}/${alias}`)
			.then(u => new User(u.name, u.alias, new Attachment(u.photo.src, AttachmentType.PHOTO)))

	public getUsers = async (aliases: string[]) =>
		this.___get<User[]>(`${this.___baseUrl}/users?aliases=${JSON.stringify(aliases)}`)
			.then(uu => uu.map(u => new User(u.name, u.alias, new Attachment(u.photo.src, u.photo.attachmentType))))

	public getStory = async (alias: string, lastKey: string, numResults: number) =>
		this.___get<Status[]>(`${this.___baseUrl}/${alias}/story/${lastKey}/${numResults}`)
			.then(ss => ss.map(obj => {
				const s = new Status(obj.alias, obj.text)
				s.timestamp = obj.timestamp
				if (obj.attachment) s.attachment = new Attachment(obj.attachment.src, obj.attachment.attachmentType)
				return s
			}))

	public getFeed = async (alias: string, lastKey: string, numResults: number) =>
		this.___get<Status[]>(`${this.___baseUrl}/${alias}/feed/${lastKey}/${numResults}`)
			.then(ss => ss.map(s => {
				const status = new Status(s.alias, s.text)
				status.timestamp = s.timestamp
				if (s.attachment) status.attachment = new Attachment(s.attachment.src, s.attachment.attachmentType)
				return status
			}))

	public getHashtags = async (hashtag: string, lastKey: string, numResults: number) =>
		this.___get<Status[]>(`${this.___baseUrl}/status/hashtag/${hashtag}/${lastKey}/${numResults}`)
			.then(ss => ss.map(s => {
				const status = new Status(s.alias, s.text)
				status.timestamp = s.timestamp
				if (s.attachment) status.attachment = new Attachment(s.attachment.src, s.attachment.attachmentType)
				return status
			}))

	public follow = (alias: string, followee: string) =>
		this.___post<string>(`${this.___baseUrl}/${alias}/following?followee=${followee}`)

	public unfollow = (alias: string, followee: string) =>
		this.___delete<string>(`${this.___baseUrl}/${alias}/following?followee=${followee}`)

	public listFollowing = (alias: string, lastKey: string, numResults: number) =>
		this.___get<string[]>(`${this.___baseUrl}/${alias}/following/${lastKey}/${numResults}`)

	public listFollowers = (alias: string, lastKey: string, numResults: number) =>
		this.___get<string[]>(`${this.___baseUrl}/${alias}/followers/${lastKey}/${numResults}`)

	public addStatus = (status: Status) =>
		this.___post<Status, Status>(`${this.___baseUrl}/status`, status)

	public getStatus = (alias: string, timestamp: number) =>
		this.___get<Status>(`${this.___baseUrl}/status/${alias}/${timestamp}`)
			.then(s => {
				const status = new Status(s.alias, s.text)
				status.timestamp = s.timestamp
				if (s.attachment) status.attachment = new Attachment(s.attachment.src, s.attachment.attachmentType)
				return status
			})

	private async ___get<R>(url: string) {
		return fetch(url).then(async r => (await r.json()).body as R)
	}

	private async ___post<R, B = {}>(url: string, body?: B, params: RequestInit = {}) {
		return fetch(url, {
			...params,
			method: `POST`,
			headers: {
				'Content-Type': `application/json`,
			},
			body: JSON.stringify(body),
		}).then(async r => (await r.json()).body as R)
	}

	private async ___delete<R, B = {}>(url: string, body?: B, params: RequestInit = {}) {
		return fetch(url, {
			...params,
			method: `DELETE`,
			headers: {
				'Content-Type': `application/json`,
			},
			body: JSON.stringify(body),
		}).then(async r => (await r.json()).body as R)
	}

	private async ___patch<R, B = {}>(url: string, body?: B, params: RequestInit = {}) {
		return fetch(url, {
			...params,
			method: `PATCH`,
			headers: {
				'Content-Type': `application/json`,
			},
			body: JSON.stringify(body),
		}).then(async r => (await r.json()).body as R)
	}
}
