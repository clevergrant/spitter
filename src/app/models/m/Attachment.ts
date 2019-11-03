/* eslint-disable @typescript-eslint/quotes */

export enum AttachmentType {
	PHOTO = 'PHOTO',
	VIDEO = 'VIDEO'
}

export class Attachment {
	public src: string
	public attachmentType: AttachmentType

	constructor(src: string, attachmentType: AttachmentType) {
		this.src = src
		this.attachmentType = attachmentType
	}
}
