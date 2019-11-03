import { User } from './User'
import { Attachment } from './Attachment'

export class PUser extends User {

	public password: string

	constructor(name: string, alias: string, password: string, photo: Attachment) {
		super(name, alias, photo)
		this.password = password
	}

	public checkPassword = (password: string): boolean => {
		return this.password === password
	}
}
