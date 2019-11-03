import short from 'short-uuid'
import { Attachment } from './Attachment'

const t = short()

export class User {

	public id: string
	public alias: string
	public name: string
	public photo: Attachment

	public following: string[] = []
	public followers: string[] = []

	constructor(name: string, alias: string, photo: Attachment) {
		this.id = t.new()
		this.alias = alias
		this.name = name
		this.photo = photo
	}
}
