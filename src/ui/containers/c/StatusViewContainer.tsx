import React, { FC, MouseEvent, CSSProperties } from 'react'
import {
	Link,
	useHistory,
} from 'react-router-dom'
import reactStringReplace from 'react-string-replace'

import { User, Status } from 'app/models'

import { StatusView } from 'ui/components'

interface Props {
	status: Status
	user: User
	style?: CSSProperties
}

const StatusViewContainer: FC<Props> = props => {

	const {
		status,
		user,
	} = props

	const history = useHistory()

	const handleStatusClick = (to: string) => (e: MouseEvent) => {
		if ((e.target as HTMLElement).tagName !== `A`) history.push(`/status/${to}`)
	}

	const hashtags = status.getHashtags()
	const mentions = status.getMentions()
	const urls = status.getUrls()

	const linkedStatus: any[] = [status.text]

	let index = 0

	hashtags.forEach(hashtag => {
		linkedStatus.forEach((part, i) => {
			linkedStatus.splice(i, 1, reactStringReplace(part, hashtag, match => {
				const comp = <Link key={index} to={`/hashtag/${match.substring(1)}`} className='status-link' data-type='hashtag'>{match}</Link>
				index++
				return comp
			}))
		})
	})

	mentions.forEach(mention => {
		linkedStatus.forEach((part, i) => {
			linkedStatus.splice(i, 1, reactStringReplace(part, mention, match => {
				const comp = <Link key={index} to={`/user/${match.substring(1)}`} className='status-link' data-type='mention'>{match}</Link>
				index++
				return comp
			}))
		})
	})

	urls.forEach(url => {
		linkedStatus.forEach((part, i) => {
			linkedStatus.splice(i, 1, reactStringReplace(part, url, match => {
				const comp = <a key={index} className='status-link' href={match} target='_blank' rel='noopener noreferrer'>{match}</a>
				index++
				return comp
			}))
		})
	})

	const months = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`]

	const date = `${months[new Date(status.timestamp).getMonth()]} ${new Date(status.timestamp).getDate()}`

	const viewstate = {
		id: status.id,
		user,
		date,
		linkedStatus,
		attachment: status.attachment,
	}

	const handlers = {
		handleStatusClick,
	}

	return <StatusView viewstate={viewstate} handlers={handlers} />
}

export default StatusViewContainer
