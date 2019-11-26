import { Status } from 'app/models'

export interface StatusService {
	getStory: (alias: string, lastId: string, numResults: number) => Promise<Status[]>
	getFeed: (alias: string, lastId: string, numResults: number) => Promise<Status[]>
	getHashtags: (hashtag: string, lastId: string, numResults: number) => Promise<Status[]>
	getStatus: (id: string) => Promise<Status>
	addStatus: (status: Status) => Promise<string>
}