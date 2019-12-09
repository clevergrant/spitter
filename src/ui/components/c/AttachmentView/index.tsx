import React, { FC } from 'react'

import { Attachment, AttachmentType } from 'app/models'

import './style.css'

interface Props {
	attachment: Attachment
	removeAttachment?: () => void
}

const AttachmentView: FC<Props> = ({ attachment, removeAttachment }) => {

	const url = new URL(attachment.src)

	const id = url.hostname === `youtu.be` ? url.pathname.substring(1) : url.search.substring(1).split(`&`).reduce((acc: { [key: string]: string }, item) => {
		const [key, val] = item.split(`=`)
		acc[key] = val
		return acc
	}, {}).v

	return (
		<div className='attachment-view'>
			{removeAttachment && <button type='button' onClick={removeAttachment}>+</button>}

			{attachment.type === AttachmentType.PHOTO &&
				<img src={attachment.src} alt={attachment.src} />
			}

			{attachment.type === AttachmentType.VIDEO &&
				<iframe
					title={attachment.src}
					width='480'
					height='320'
					src={`https://www.youtube.com/embed/${id}`}
					frameBorder='0'
					allow='encrypted-media; picture-in-picture'
					allowFullScreen />
			}
		</div>
	)
}

export default AttachmentView