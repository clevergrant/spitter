import authService from
	// './s/test/AuthService'
	'./s/AuthService'

import statusService from
	// './s/test/StatusService'
	'./s/StatusService'

import userService from
	// './s/test/UserService'
	'./s/UserService'

import { IAuthService } from 'app/interfaces/auth'
import { IStatusService } from 'app/interfaces/status'
import { IUserService } from 'app/interfaces/user'

export class Services {
	public readonly authService: IAuthService = authService
	public readonly statusService: IStatusService = statusService
	public readonly userService: IUserService = userService
}

export default new Services()
