import AwsProxy from './p/AwsProxy'

const awsProxy = new AwsProxy()

export {
	AwsProxy,
	awsProxy,
}

export class Proxies {
	awsProxy: AwsProxy = awsProxy
}

const proxies = new Proxies()

export default proxies
