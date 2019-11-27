import AwsProxy from './p/AwsProxy'

const awsProxy = new AwsProxy()

export class Proxies {
	awsProxy: AwsProxy = awsProxy
}

export {
	AwsProxy,
	awsProxy,
}

export default new Proxies()
