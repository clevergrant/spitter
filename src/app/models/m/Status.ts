import { Attachment } from './Attachment'

export class Status {

	public alias: string
	public text: string
	public attachment?: Attachment
	public timestamp: number

	constructor(alias: string, text: string, attachment?: Attachment) {
		this.alias = alias
		this.text = text
		this.attachment = attachment
		this.timestamp = Date.now()
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