import { AttachmentType } from 'app/models'

export const elementTopInView = (el: HTMLElement) => el.getBoundingClientRect().top <=(window.innerHeight || document.documentElement.clientHeight)

export const mimeToAttachmentType = (type: string): AttachmentType => {
	switch(type) {
	case `image/jpeg`:
	case `image/png`:
	case `image/gif`:
	case `image/vnd.microsoft.icon`:
	case `image/bmp`:
	case `image/svg+xml`:
	case `image/tiff`:
	case `image/webp`:
		return AttachmentType.PHOTO

	case `youtube`:
		return AttachmentType.VIDEO

	default:
		throw new Error(`File type is not supported.`)
	}
}
