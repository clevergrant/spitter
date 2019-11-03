import React, { FC, MouseEvent, ChangeEvent, FormEvent } from 'react'

import { Attachment } from 'app/models'

import { ImageCircle } from 'ui/components'

import './style.css'

interface Props {
	handlers: {
		handleNameChange: (event: ChangeEvent<HTMLInputElement>) => void
		handleAliasChange: (event: ChangeEvent<HTMLInputElement>) => void
		handlePasswordChange: (event: ChangeEvent<HTMLInputElement>) => void
		handleFileChange: (event: any) => void
		handleLogin: (event: FormEvent<HTMLFormElement>) => void
		handleRegister: (event: FormEvent<HTMLFormElement>) => void
		toggleIsLogin: (e: MouseEvent<HTMLButtonElement>) => void
	}
	viewstate: {
		isLogin: boolean
		alias: string
		name: string
		password: string
		message: string
		file: string
		photo?: Attachment
	}
}

const Login: FC<Props> = ({ handlers, viewstate }) => {

	const {
		handleNameChange,
		handleAliasChange,
		handlePasswordChange,
		handleFileChange,
		handleLogin,
		handleRegister,
		toggleIsLogin,
	} = handlers

	const {
		isLogin,
		alias,
		name,
		password,
		message,
		file,
		photo,
	} = viewstate

	return (
		<div id='login'>

			<h1>{isLogin ? `Log In` : `Sign Up`}</h1>

			<form onSubmit={isLogin ? handleLogin : handleRegister}>

				{isLogin ||
					<label htmlFor='login-name'>
						<input placeholder='Full Name' id='login-name' type='text' value={name} onChange={handleNameChange} required />
					</label>
				}

				<label htmlFor='login-username'>
					<input placeholder='Alias' id='login-username' type='text' value={alias} onChange={handleAliasChange} required />
				</label>

				<label htmlFor='login-password'>
					<input placeholder='Password' id='login-password' type='password' value={password} onChange={handlePasswordChange} required />
				</label>

				{isLogin ||
					<>
						<label htmlFor='login-file' className='label-button'>
							Choose Picture
							{/* <label htmlFor='login-file' className='label-button'>Choose Picture</label> */}
							<input id='login-file' type='file' value={file} onChange={handleFileChange} required hidden />
						</label>

						{photo ?
							<div style={{ display: `flex`, justifyContent: `center`, margin: `1rem 0` }}>
								<ImageCircle dataUrl={photo.src} alt={`Do you want this picture?`} size={6} />
							</div>
							:
							<div className='img-circle-placeholder' />
						}
					</>
				}

				<button type='submit' className='primary'>{isLogin ? `Log In` : `Sign Up`}</button>

			</form>

			<small style={{ color: `red` }}>{message}</small>

			<br />

			<p>{isLogin ? `Don't` : `Already`} have an account? <button onClick={toggleIsLogin}>{isLogin ? `Sign Up` : `Log In`}</button></p>

		</div>
	)
}

export default Login
