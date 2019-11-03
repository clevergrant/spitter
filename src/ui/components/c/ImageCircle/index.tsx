import React from 'react'

import './style.css'

interface Props {
	dataUrl?: string
	alt?: string
	size?: number
}

const ImageCircle: React.FC<Props> = ({ dataUrl, alt, size }) => {
	return (
		<div className='user-pic' style={size ? { height: `${2.5 * size}rem`, width: `${2.5 * size}rem` } : {}}>
			{dataUrl && <img src={dataUrl} alt={alt} style={size ? { height: `${2.5 * size}rem`, width: `${2.5 * size}rem` } : {}} />}
		</div>
	)
}

export default ImageCircle
