import React, { FC, useState, ChangeEvent, FormEvent } from 'react'
import { connect } from 'react-redux'

import { Status, Attachment, AttachmentType, User } from 'app/models'

import { actions, RootStore } from 'app/store'
import { AddStatusDone } from 'app/store/status/types'

import { Spitter } from 'ui/components'

interface Props {
	user?: User
	addStatus: (status: Status) => Promise<AddStatusDone>
}

const SpitterContainer: FC<Props> = ({
	user,
	addStatus,
}) => {

	const [spit, setSpit] = useState(``)
	const [attachment, setAttachment]: [Attachment | undefined, Function] = useState()

	const removeAttachment = () => {
		setAttachment(undefined)
	}

	const handleSpitChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSpit(e.target.value)
	}

	const handleAttachmentChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const list: FileList = e.target.files as FileList

		const el = e.target

		if (list.length > 0) {
			const file: File = list[0]

			const attachment: Attachment = {
				src: ``,
				attachmentType: AttachmentType.PHOTO,
				file,
			}

			if (file.type.startsWith(`video/`)) attachment.attachmentType = AttachmentType.VIDEO

			const getFile = new Promise<string>((resolve, reject) => {
				const reader = new FileReader()
				reader.onerror = reject
				reader.onload = () => {
					resolve(reader.result as string)
				}
				reader.readAsDataURL(file)
			}).catch(error => {
				console.error(error)
				el.value = ``
			})

			attachment.src = await getFile as string

			setAttachment(attachment)
		}
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (user && attachment) {
			const newStatus: Status = new Status(user.alias, spit, attachment)
			addStatus(newStatus)
		}
		console.log(e.target)
	}

	const viewstate = {
		spit,
		attachment,
	}

	const handlers = {
		removeAttachment,
		handleSpitChange,
		handleAttachmentChange,
		handleSubmit,
	}

	return <Spitter viewstate={viewstate} handlers={handlers} />
}

const mapStoreToProps = (store: RootStore) => ({
	user: store.authStore.user,
})

const mapDispatchToProps = {
	addStatus: actions.addStatus,
}

export default connect(mapStoreToProps, mapDispatchToProps)(SpitterContainer)
