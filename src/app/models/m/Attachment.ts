/* eslint-disable @typescript-eslint/quotes */

export enum AttachmentType {
	PHOTO = 'PHOTO',
	VIDEO = 'VIDEO'
}

export class Attachment {
	public src: string
	public attachmentType: AttachmentType
	public file?: File

	constructor(src: string, attachmentType: AttachmentType, file?: File) {
		this.src = src
		this.attachmentType = attachmentType
		this.file = file
	}
}
