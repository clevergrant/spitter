import { Auth, Storage } from 'aws-amplify'
import { User, Attachment, AttachmentType, Status } from 'app/models'

export default class AwsProxy {

	private ___baseUrl = `https://42l3t7qs2l.execute-api.us-west-2.amazonaws.com/v1`

	public login = async (alias: string, password: string) => {
		const { username, attributes } = await Auth.signIn(alias, password)
		const { name, picture } = attributes
		return this.___userWithFile({
			name,
			alias: username,
			photo: {
				src: picture,
				type: AttachmentType.PHOTO,
			},
		} as User)
	}

	public register = async (name: string, alias: string, password: string, photo: Attachment) => {

		if (!photo.file) throw new Error(`You didn't select a picture somehow`)

		// store the file

		const { file } = photo
		const newKey = `${alias}_${file.name}`

		const { key } = await Storage.put(newKey, file, {
			type: file.type,
		}) as { key: string }

		await Auth.signUp({
			username: alias,
			password,
			attributes: {
				name,
				picture: key,
			},
		}).then(() => {
			this.___post<undefined, User>(
				`${this.___baseUrl}/user`,
				new User(
					name,
					alias,
					new Attachment(key, photo.type)
				)
			)
		})

		return this.login(alias, password)
	}

	public logout = (global: boolean) => Auth.signOut({ global })

	public check = async () => {
		const { username, attributes } = await Auth.currentAuthenticatedUser()
		return this.___userWithFile({
			name: attributes.name,
			alias: username,
			photo: {
				src: attributes.picture,
				type: AttachmentType.PHOTO,
			},
		} as User)
	}

	public editUser = async (user: User) => {

		if (!user.photo.file) throw new Error(`You didn't select a picture somehow`)

		const key = `${user.alias}_${user.photo.file.name}`

		await Storage.put(key, user.photo.file, {
			type: user.photo.file.type,
		})

		console.log(user)

		const newUser = new User(
			user.name,
			user.alias,
			new Attachment(key, AttachmentType.PHOTO)
		)

		return await this.___patch<User, User>(`${this.___baseUrl}/${user.alias}`, newUser)
			.then(({ name, alias, photo }) =>
				this.___userWithFile({
					name,
					alias,
					photo: {
						src: photo.src,
						type: photo.type,
					},
				} as User)
			)
	}

	public getUser = async (alias: string) =>
		this.___get<User>(`${this.___baseUrl}/${alias}`)
			.then(({ name, alias, photo }) =>
				this.___userWithFile({
					name,
					alias,
					photo: {
						src: photo.src,
						type: photo.type,
					},
				} as User)
			)

	public getUsers = async (aliases: string[]) =>
		this.___get<User[]>(`${this.___baseUrl}/user?aliases=${JSON.stringify(aliases)}`)
			.then(uu => Promise.all(uu.map(({ name, alias, photo }) =>
				this.___userWithFile({
					name,
					alias,
					photo: {
						src: photo.src,
						type: photo.type,
					},
				} as User)
			)))

	public getStory = async (alias: string, count: number, prev?: string) =>
		this.___get<Status[]>(`${this.___baseUrl}/${alias}/story?count=${count}${prev ? `&prev=${prev}` : ``}`)
			.then(ss => Promise.all(ss.map(({ alias, text, attachment, timestamp }) =>
				this.___makeStatus({
					alias,
					text,
					attachment,
					timestamp,
				} as Status)
			)))

	public getFeed = async (alias: string, count: number, prev?: string) =>
		this.___get<Status[]>(`${this.___baseUrl}/${alias}/feed?count=${count}${prev ? `&prev=${prev}` : ``}`)
			.then(ss => Promise.all(ss.map(({ alias, text, attachment, timestamp }) =>
				this.___makeStatus({
					alias,
					text,
					attachment,
					timestamp,
				} as Status)
			)))

	public getHashtags = async (hashtag: string, count: number, prev?: string) => {
		return this.___get<Status[]>(encodeURI(`${this.___baseUrl}/status/hashtag/${hashtag}?count=${count}${prev ? `&prev=${prev}` : ``}`))
			.then(ss => Promise.all(ss.map(({ alias, text, attachment, timestamp }) =>
				this.___makeStatus({
					alias,
					text,
					attachment,
					timestamp,
				} as Status)
			)))
	}

	public follow = async (follower: string, followee: string) => {
		await this.___post<string>(`${this.___baseUrl}/${follower}/following?followee=${followee}`)
		return this.listFollowers(followee)
	}

	public unfollow = async (follower: string, followee: string) => {
		await this.___delete<string>(`${this.___baseUrl}/${follower}/following?followee=${followee}`)
		return this.listFollowers(followee)
	}

	public listFollowing = (alias: string, count?: number, prev?: string) =>
		this.___get<string[]>(`${this.___baseUrl}/${alias}/following${count ? `?count=${count}` : ``}${(count && prev) ? `&prev=${prev}` : ``}`)

	public listFollowers = (alias: string, count?: number, prev?: string) =>
		this.___get<string[]>(`${this.___baseUrl}/${alias}/followers${count ? `?count=${count}` : ``}${(count && prev) ? `&prev=${prev}` : ``}`)

	public getFollowingCount = (alias: string) =>
		this.___get<number>(`${this.___baseUrl}/${alias}/following/count`)

	public getFollowerCount = (alias: string) =>
		this.___get<number>(`${this.___baseUrl}/${alias}/followers/count`)

	public addStatus = async (status: Status) => {

		const newStatus = new Status(status.alias, status.text)
		newStatus.timestamp = status.timestamp

		if (status.attachment) {
			if (status.attachment.file) {

				// store the file

				const { file } = status.attachment
				const newKey = `${status.alias}_${file.name}`

				const { key } = await Storage.put(newKey, file, {
					type: file.type,
				}) as { key: string }

				newStatus.attachment = new Attachment(key, status.attachment.type)
			} else newStatus.attachment = status.attachment
		}

		return this.___post<Status, Status>(`${this.___baseUrl}/status`, newStatus)
	}

	public getStatus = (alias: string, timestamp: number) =>
		this.___get<Status>(`${this.___baseUrl}/status/${alias}/${timestamp}`)
			.then(({ alias, text, attachment, timestamp }) =>
				this.___makeStatus({
					alias,
					text,
					attachment,
					timestamp,
				} as Status)
			)

	public checkFollowing = (follower: string, followee: string) =>
		this.___get<boolean>(`${this.___baseUrl}/${follower}/following/${followee}`)

	private async ___get<R>(url: string) {
		return await fetch(url).then(r => r.json()) as R
	}

	private async ___post<R, B = {}>(url: string, body?: B, params: RequestInit = {}) {
		return await fetch(url, {
			...params,
			method: `POST`,
			headers: {
				'Content-Type': `application/json`,
			},
			body: JSON.stringify(body),
		}).then(r => r.json()) as R
	}

	private async ___delete<R, B = {}>(url: string, body?: B, params: RequestInit = {}) {
		return await fetch(url, {
			...params,
			method: `DELETE`,
			headers: {
				'Content-Type': `application/json`,
			},
			body: JSON.stringify(body),
		}).then(r => r.json()) as R
	}

	private async ___patch<R, B = {}>(url: string, body?: B, params: RequestInit = {}) {
		return await fetch(url, {
			...params,
			method: `PATCH`,
			headers: {
				'Content-Type': `application/json`,
			},
			body: JSON.stringify(body),
		}).then(r => r.json()) as R
	}

	private async ___getBlob(url: string, params: RequestInit = {}) {
		return await fetch(url, params)
			.then(r => r.blob())
	}

	private async ___userWithFile(user: User): Promise<User> {
		const url = await Storage.get(user.photo.src) as string
		const file = new File([await this.___getBlob(url)], user.photo.src)
		const att = new Attachment(URL.createObjectURL(file), user.photo.type, file, file.name)
		return new User(user.name, user.alias, att)
	}

	private async ___statusWithFile(status: Status): Promise<Status> {
		if (!status.attachment) throw new Error(`Need an attachment to run this function`)
		if (status.attachment.type === AttachmentType.PHOTO) {
			const url = await Storage.get(status.attachment.src) as string
			const file = new File([await this.___getBlob(url)], status.attachment.src)
			const att = new Attachment(URL.createObjectURL(file), status.attachment.type, file, file.name)
			const s = new Status(status.alias, status.text, att)
			s.timestamp = status.timestamp
			return s
		} else {
			const att = new Attachment(status.attachment.src, status.attachment.type)
			const s = new Status(status.alias, status.text, att)
			s.timestamp = status.timestamp
			return s
		}
	}

	private async ___makeStatus(status: Status): Promise<Status> {
		if (status.attachment) return this.___statusWithFile(status)
		const s = new Status(status.alias, status.text)
		s.timestamp = status.timestamp
		return s
	}
}
