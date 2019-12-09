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

	public get id(): string {
		return `${this.alias}${this.timestamp}`
	}

	public get urls(): string[] {
		const urls = this.text.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g) || []
		return urls.filter((v, i) => urls.indexOf(v) === i)
	}

	public get mentions(): string[] {
		const men = this.text.match(/\B@\w\w+\b/g) || []
		return men.filter((v, i) => men.indexOf(v) === i)
	}

	public get hashtags(): string[] {
		const tags = this.text.match(/\B#\w\w+\b/g) || []
		return tags.filter((v, i) => tags.indexOf(v) === i)
	}

}
