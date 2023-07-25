// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from 'workerize-loader!./worker'

const workerInstance = worker()

export default workerInstance;