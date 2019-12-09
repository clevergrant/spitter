import React, { FC, useState, ChangeEvent, FormEvent, MouseEvent } from 'react'
import { connect } from 'react-redux'

import { Status, Attachment, User, AttachmentType } from 'app/models'

import services from 'app/services'
import { RootStore } from 'app/services/store'

import { AddStatusDone } from 'app/interfaces/status'

import { Spitter } from 'ui/components'

import { mimeToAttachmentType } from 'lib/util'

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
		try {
			const list = e.target.files as FileList
			if (!list.length) return
			const file: File = list[0]
			const attachment = new Attachment(
				URL.createObjectURL(file),
				mimeToAttachmentType(file.type),
				file
			)
			setAttachment(attachment)
		} catch (error) {
			alert(error.message)
		}
	}

	const handleAddYTLink = async (e: MouseEvent<HTMLInputElement>) => {
		e.preventDefault()
		const link = prompt(`Input the YouTube Link:`)
		if (link) {
			setAttachment(new Attachment(
				link,
				AttachmentType.VIDEO
			))
		}
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!user) return
		if (!spit) return

		if (attachment) {
			const newStatus: Status = new Status(user.alias, spit, attachment)
			await addStatus(newStatus)
		} else await addStatus(new Status(user.alias, spit))

		setSpit(``)
		setAttachment(undefined)
	}

	const viewstate = {
		spit,
		attachment,
	}

	const handlers = {
		removeAttachment,
		handleSpitChange,
		handleAttachmentChange,
		handleAddYTLink,
		handleSubmit,
	}

	return <Spitter viewstate={viewstate} handlers={handlers} />
}

const mapStoreToProps = (store: RootStore) => ({
	user: store.authStore.user,
})

const mapDispatchToProps = {
	addStatus: services.statusService.addStatus,
}

export default connect(mapStoreToProps, mapDispatchToProps)(SpitterContainer)
