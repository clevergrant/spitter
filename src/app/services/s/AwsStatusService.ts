import { StatusService } from 'app/interfaces'
import { Status } from 'app/models'
import { awsProxy } from 'app/proxy'

export default class AwsStatusService implements StatusService {

	getStory = (alias: string, lastId: string, numResults: number) => new Promise<Status[]>((resolve, reject) => {
		awsProxy.getStory(alias, lastId, numResults)
			.then(resolve)
			.catch(reject)
	})

	getFeed = (alias: string, lastId: string, numResults: number) => new Promise<Status[]>((resolve, reject) => {
		awsProxy.getFeed(alias, lastId, numResults)
			.then(resolve)
			.catch(reject)
	})

	getHashtags = (hashtag: string, lastId: string, numResults: number) => new Promise<Status[]>((resolve, reject) => {
		awsProxy.getHashtags(hashtag, lastId, numResults)
			.then(resolve)
			.catch(reject)
	})

	getStatus = (id: string) => new Promise<Status>((resolve, reject) => {
		awsProxy.getStatus(id)
			.then(resolve)
			.catch(reject)
	})

	addStatus = (status: Status) => new Promise<string>((resolve, reject) => {
		awsProxy.addStatus(status)
			.then(resolve)
			.catch(reject)
	})

}
