import { StatusService } from 'app/interfaces'

import { Status, Attachment } from 'app/models'

import { apiGatewayProxy } from 'app/proxy'

export class AwsStatusService implements StatusService {

	getStory = (alias: string, lastId: string, numResults: number) => new Promise<Status[]>((resolve, reject) => {
		apiGatewayProxy.getStory(alias, lastId, numResults)
			.then(r => {
				console.log(r)
				resolve(r)
			})
			.catch(reject)
	})

	getFeed = (aliases: string[]) => new Promise<Status[]>((resolve, reject) => {

	})

	getHashtags = (hashtag: string) => new Promise<Status[]>((resolve, reject) => {

	})

	getStatus = (id: string) => new Promise<Status>((resolve, reject) => {

	})

	addStatus = (status: Status) => new Promise<void>((resolve, reject) => {

	})

}