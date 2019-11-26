import { UserService } from 'app/interfaces'

import { awsProxy } from 'app/proxy'

export default class AwsUserService implements UserService {

	getAllUsers = async () => await awsProxy.getAllUsers()

	getFollowing = async (alias: string, lastId: string, numResults: number) => await awsProxy.listFollowing(alias, lastId, numResults)

	getFollowers = async (alias: string, lastId: string, numResults: number) => await awsProxy.listFollowers(alias, lastId, numResults)
}
