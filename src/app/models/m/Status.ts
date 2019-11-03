import short from 'short-uuid'

import { Attachment } from './Attachment'

const t = short()

export class Status {

	public id: string

	public alias: string
	public text: string

	public attachment?: Attachment

	public timestamp: Date

	constructor(alias: string, text: string, attachment?: Attachment) {
		this.id = t.new()
		this.alias = alias
		this.text = text
		this.attachment = attachment
		this.timestamp = new Date()
	}

	public getUrls(): string[] {
		const result = this.text.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g)
		if (result !== null)
			return result
		return []
	}

	public getMentions(): string[] {
		const result = this.text.match(/\B@\w\w+\b/g)
		if (result !== null)
			return result
		return []
	}

	public getHashtags(): string[] {
		const result = this.text.match(/\B#\w\w+\b/g)
		if (result !== null)
			return result
		return []
	}

}