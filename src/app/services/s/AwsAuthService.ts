import { AuthService } from 'app/interfaces'
import { awsProxy } from 'app/proxy'
import { Attachment } from 'app/models'

export default class AwsAuthService implements AuthService {
	login = (alias: string, password: string) => awsProxy.login(alias, password)
	register = (name: string, alias: string, password: string, photo: Attachment) => awsProxy.register(name, alias, password, photo).then(() => awsProxy.login(alias, password))
	logout = () => awsProxy.logout(false) as Promise<void>
	check = () => awsProxy.check()
	// getUser = (alias: string) => amplifyProxy.getUser(alias)
	// getUsers = (aliases: string[]) => amplifyProxy.getUsers(aliases)
}
