/* eslint-disable @typescript-eslint/quotes */

export enum AttachmentType {
	PHOTO = 'PHOTO',
	VIDEO = 'VIDEO'
}

export class Attachment {
	public src: string
	public type: AttachmentType
	public file?: File
	public s3key?: string

	constructor(src: string, type: AttachmentType, file?: File, s3key?: string) {
		this.src = src
		this.type = type
		this.file = file
		this.s3key = s3key
	}

	public static fromBlob(s3key: string, blob: Blob): Attachment {
		const bag: FilePropertyBag = { type: blob.type }
		const file = new File([blob], s3key, bag)
		return new Attachment(
			URL.createObjectURL(file),
			AttachmentType.PHOTO,
			file,
			s3key
		)
	}
}