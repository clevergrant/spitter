import React, { FC, MouseEvent, ChangeEvent, FormEvent } from 'react'

import { Attachment } from 'app/models'

import { AttachmentView } from 'ui/components'

import './style.css'

interface Props {
	viewstate: {
		spit: string
		attachment?: Attachment
	}
	handlers: {
		removeAttachment: () => void
		handleSpitChange: (e: ChangeEvent<HTMLInputElement>) => void
		handleAttachmentChange: (e: ChangeEvent<HTMLInputElement>) => void
		handleSubmit: (e: FormEvent<HTMLFormElement>) => void
		handleAddYTLink: (e: MouseEvent<HTMLInputElement>) => void
	}
}

const Spitter: FC<Props> = ({ viewstate, handlers }) => {

	const {
		spit,
		attachment,
	} = viewstate

	const {
		removeAttachment,
		handleSpitChange,
		handleAttachmentChange,
		handleSubmit,
		handleAddYTLink,
	} = handlers

	return (
		<div className='spit'>

			<form onSubmit={handleSubmit}>

				<div className='spit-text'>
					<input placeholder='Got something to say?' type='text' name='spit' id='input-spit' value={spit} onChange={handleSpitChange} />
					<button type='submit'>Spit</button>
				</div>

				{attachment ?
					<AttachmentView attachment={attachment} removeAttachment={removeAttachment} />
					:
					<div className='spit-attachment'>
						<label htmlFor='input-attachment' className='label-attachment'>+ Photo</label>

						<label htmlFor='input-video' className='label-attachment'>+ YouTube</label>

						<input type='file' name='attachment' id='input-attachment' onChange={handleAttachmentChange} hidden />
						<input type='button' name='video' id='input-video' onClick={handleAddYTLink} hidden />
					</div>
				}

			</form>

		</div>
	)
}

export default Spitter
