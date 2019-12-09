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

	const handleStatusClick = (alias: string, timestamp: number) => (e: MouseEvent) => {
		if ((e.target as HTMLElement).tagName !== `A`) history.push(`/status/${alias}/${timestamp}`)
	}

	const {
		hashtags,
		mentions,
		urls,
	} = status

	const linkedStatusText: any[] = [status.text]

	let index = 0

	hashtags.sort((a, b) => b.length - a.length || a.localeCompare(b)).forEach(hashtag => {
		linkedStatusText.forEach((part, i) => {
			linkedStatusText.splice(i, 1, reactStringReplace(part, hashtag, match => {
				const comp = <Link key={index} to={`/hashtag/${match.substring(1)}`} className='status-link' data-type='hashtag'>{match}</Link>
				index++
				return comp
			}))
		})
	})

	mentions.sort((a, b) => b.length - a.length || a.localeCompare(b)).forEach(mention => {
		linkedStatusText.forEach((part, i) => {
			linkedStatusText.splice(i, 1, reactStringReplace(part, mention, match => {
				const comp = <Link key={index} to={`/user/${match.substring(1)}`} className='status-link' data-type='mention'>{match}</Link>
				index++
				return comp
			}))
		})
	})

	urls.sort((a, b) => b.length - a.length || a.localeCompare(b)).forEach(url => {
		linkedStatusText.forEach((part, i) => {
			linkedStatusText.splice(i, 1, reactStringReplace(part, url, match => {
				const comp = <a key={index} className='status-link' href={match} target='_blank' rel='noopener noreferrer'>{match}</a>
				index++
				return comp
			}))
		})
	})

	const months = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`]

	const date = `${months[new Date(status.timestamp).getMonth()]} ${new Date(status.timestamp).getDate()}`

	const viewstate = {
		status,
		user,
		date,
		linkedStatusText,
	}

	const handlers = {
		handleStatusClick,
	}

	return <StatusView viewstate={viewstate} handlers={handlers} />
}

export default StatusViewContainer
