import React, {
	FC,
	useState,
	useEffect,
	ChangeEvent,
	FormEvent,
	MouseEvent,
} from 'react'
import { connect } from 'react-redux'

import { Attachment } from 'app/models'

import services from 'app/services'
import { RootStore } from 'app/services/store'

import { LoginDone } from 'app/interfaces/auth'

import { Login } from 'ui/components'
import { mimeToAttachmentType } from 'lib/util'

interface Props {
	validationMessage: string
	login: (alias: string, password: string) => Promise<LoginDone>
	register: (name: string, alias: string, password: string, photo: Attachment) => Promise<LoginDone>
}

const LoginContainer: FC<Props> = props => {

	const {
		validationMessage,
		login,
		register,
	} = props

	const [isLogin, setIsLogin]: [boolean, Function] = useState(true)
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
		try {
			setFile(e.target.value)
			const list = e.target.files as FileList
			if (!list.length) return
			const file: File = list[0]
			const photo = new Attachment(
				URL.createObjectURL(file),
				mimeToAttachmentType(file.type),
				file
			)
			setPhoto(photo)
		} catch (error) {
			console.error(error)
			alert(error.message)
		}
	}

	const handleLogin = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		login(alias, password)
		setMessage(``)
	}

	const handleRegister = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (photo)
			register(name, alias, password, photo)
		else setMessage(`Please select a photo.`)
		setMessage(``)
	}

	const toggleIsLogin = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		setIsLogin(!isLogin)
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

	return <Login viewstate={viewstate} handlers={handlers} />

}

const mapStoreToProps = (store: RootStore) => ({
	validationMessage: store.authStore.validationMessage,
})

const mapDispatchToProps = {
	login: services.authService.login,
	register: services.authService.register,
}

export default connect(mapStoreToProps, mapDispatchToProps)(LoginContainer)
