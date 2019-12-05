import { Attachment } from './Attachment'

export class User {

	public alias: string
	public name: string
	public photo: Attachment

	constructor(name: string, alias: string, photo: Attachment) {
		this.alias = alias
		this.name = name
		this.photo = photo
	}
}
