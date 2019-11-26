import AwsAuthService from './s/AwsAuthService'
import AwsStatusService from './s/AwsStatusService'
import AwsUserService from './s/AwsUserService'

import {
	AuthService,
	StatusService,
	UserService,
} from 'app/interfaces'

const authService = new AwsAuthService()
const awsStatusService = new AwsStatusService()
const awsUserService = new AwsUserService()

export class Services {
	public authService: AuthService
	public statusService: StatusService
	public userService: UserService

	constructor(
		authService: AuthService,
		statusService: StatusService,
		userService: UserService,
	) {
		this.authService = authService
		this.statusService = statusService
		this.userService = userService
	}
}

const services = new Services(
	authService,
	awsStatusService,
	awsUserService,
)

export default services
