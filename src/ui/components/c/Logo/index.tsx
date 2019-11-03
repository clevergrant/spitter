import React from 'react'

import './style.css'

interface Props {
	text?: string
	src: string
}

const Logo: React.FC<Props> = ({ text, src }) => {
	return (
		<div className='logo-wrapper'>
			{text && <h1>{text}</h1>}
			<img src={src} alt='logo'/>
		</div>
	)
}

export default Logo
