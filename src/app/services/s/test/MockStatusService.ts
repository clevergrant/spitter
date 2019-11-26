import { StatusService } from 'app/interfaces'
import { Status, Attachment } from 'app/models'

import statusfile from './statuses.json'

export class MockStatusService implements StatusService {

	private static ___instance: MockStatusService

	public static getInstance() {

		if (!this.___instance) {
			this.___instance = new MockStatusService()
			this.___instance.___importStatuses()
		}

		return this.___instance
	}

	private ___statuses: Status[] = []

	public getStory = (alias: string, lastId: string, numResults: number) => new Promise<Status[]>((resolve, reject) => {
		setTimeout(() => {
			try {

				const statuses = this.___statuses
					.filter(status => status.alias === alias)
					.sort((a, b) => b.timestamp.getDate() - a.timestamp.getDate())

				if (lastId === ``) resolve(statuses.slice(0, numResults))
				else {
					const lastIndex = statuses.findIndex(status => status.id === lastId) + 1
					const nextStatuses = statuses.slice(lastIndex, lastIndex + numResults)
					resolve(nextStatuses)
				}

			} catch (error) {
				reject(error)
			}
		}, 100)
	})

	public getFeed = (alias: string, lastId: string, numResults: number) => new Promise<Status[]>((resolve, reject) => {
		setTimeout(() => {
		}, 100)
	})

	public getHashtags = (hashtag: string, lastId: string, numResults: number) => new Promise<Status[]>((resolve, reject) => {
		setTimeout(() => {
			try {

				const statuses = this.___statuses
					.filter(status => status.text.includes(hashtag))
					.sort((a, b) => a.timestamp.getDate() - b.timestamp.getDate())

				if (lastId === ``) resolve(statuses.slice(0, numResults))
				else {
					const lastIndex = statuses.findIndex(status => status.id === lastId) + 1
					const nextStatuses = statuses.slice(lastIndex, lastIndex + numResults)
					resolve(nextStatuses)
				}

			} catch (error) {
				reject(error)
			}
		}, 100)
	})

	public getStatus = (id: string) => new Promise<Status>((resolve, reject) => {
		try {

			const status = this.___statuses.find(status => status.id === id)
			resolve(status)

		} catch (error) {
			reject(error)
		}
	})

	public addStatus = (status: Status) => new Promise<string>((resolve, reject) => {
		setTimeout(() => {
			try {

				this.___statuses.push(status)
				resolve(`Status has been added.`)

			} catch (error) {
				reject(error)
			}
		}, 100)
	})

	private ___importStatuses = (): void => {
		this.___statuses = statusfile.map(status => {
			const newstatus = new Status(status.alias, status.text, status.attachment as Attachment)
			newstatus.id = status.id
			newstatus.timestamp = new Date(status.timestamp)

			return newstatus
		})
	}
}
