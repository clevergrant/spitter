import { MockAuthService } from './s/test/MockAuthService'
import { MockStatusService } from './s/test/MockStatusService'
import { MockUserService } from './s/test/MockUserService'

import {
	AuthService,
	StatusService,
	UserService,
} from 'app/interfaces'

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
	MockAuthService.getInstance(),
	MockStatusService.getInstance(),
	MockUserService.getInstance(),
)

export default services
