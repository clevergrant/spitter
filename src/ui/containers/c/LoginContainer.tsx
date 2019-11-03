import React, {
	FC,
	useState,
	useEffect,
	ChangeEvent,
	FormEvent,
	MouseEvent,
} from 'react'
import { connect } from 'react-redux'

import { Attachment, AttachmentType } from 'app/models'

import { actions, RootStore } from 'app/store'
import { LoginDone } from 'app/store/auth/types'

import { Login } from 'ui/components'

interface Props {
	validationMessage: string
	login: (alias: string, password: string) => Promise<LoginDone>
	register: (name: string, alias: string, password: string, photo: Attachment) => Promise<LoginDone>
}

const LoginContainer: FC<Props> = props => {

	const {
		validationMessage,
	} = props

	const [isLogin, setislogin]: [boolean, Function] = useState(true)
	const [name, setName]: [string, Function] = useState(``)
	const [alias, setAlias]: [string, Function] = useState(``)
	const [password, setPassword]: [string, Function] = useState(``)
	const [message, setMessage]: [string, Function] = useState(validationMessage)

	const [file, setFile]: [string, Function] = useState(``)
	const [photo, setPhoto]: [Attachment | undefined, Function] = useState()

	useEffect(() => {
		setMessage(validationMessage)
	}, [validationMessage])

	const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value)
		setMessage(``)
	}

	const handleAliasChange = (e: ChangeEvent<HTMLInputElement>) => {
		setAlias(e.target.value)
		setMessage(``)
	}

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)
		setMessage(``)
	}

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		e.persist()

		setFile(e.target.value)

		const list: FileList = e.target.files as FileList

		if (list.length <= 0) return

		const file: File = list[0]

		const getfile = new Promise<string>((resolve, reject) => {
			const reader = new FileReader()
			reader.onerror = reject
			reader.onload = () => {
				resolve(reader.result as string)
			}
			reader.readAsDataURL(file)
		}).catch(error => {
			console.error(error)
			e.target.value = ``
		})

		const photo: Attachment = {
			src: await getfile as string,
			attachmentType: AttachmentType.PHOTO,
		}

		setPhoto(photo)
	}

	const handleLogin = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		props.login(alias, password)
		setMessage(``)
	}

	const handleRegister = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		props.register(name, alias, password, photo as Attachment)
		setMessage(``)
	}

	const toggleIsLogin = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setislogin(!isLogin)
		setMessage(``)
	}

	const handlers = {
		handleNameChange,
		handleAliasChange,
		handlePasswordChange,
		handleFileChange,
		handleLogin,
		handleRegister,
		toggleIsLogin,
	}

	const viewstate = {
		isLogin,
		alias,
		name,
		password,
		message,
		file,
		photo,
	}

	return <Login handlers={handlers} viewstate={viewstate} />

}

const mapStoreToProps = (store: RootStore) => ({
	validationMessage: store.authStore.validationMessage,
})

const mapDispatchToProps = {
	login: actions.login,
	register: actions.register,
}

export default connect(mapStoreToProps, mapDispatchToProps)(LoginContainer)
