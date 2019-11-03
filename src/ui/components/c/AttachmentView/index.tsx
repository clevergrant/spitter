import React, { FC } from 'react'

import { Attachment, AttachmentType } from 'app/models'

import './style.css'

interface Props {
	attachment: Attachment
	removeAttachment?: () => void
}

const AttachmentView: FC<Props> = ({ attachment, removeAttachment }) => {
	return (
		<div className='attachment-view'>
			{removeAttachment && <button type='button' onClick={removeAttachment}>+</button>}

			{attachment.attachmentType === AttachmentType.PHOTO &&
				<img src={attachment.src} alt={attachment.src} />
			}

			{attachment.attachmentType === AttachmentType.VIDEO &&
				<p>Not sure what to do here. Rodham said we dont need to do videos, I guess.</p>
				// <video preload='metadata'>
				// 	<source src={attachment.src} />
				// </video>
			}
		</div>
	)
}

export default AttachmentView