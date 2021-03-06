import Data from './data'
import Users from './users'
import Account from './account'
import Instance from './instance'
import Event from './event'
import Endpoint from './endpoint'
import Socket from './socket'
import Trace from './trace'
import Hosting from './hosting'
import Response from './response'
import Logger from './logger'
import Channel from './channel'
import Class from './class'
import Settings from './settings'

const server = (ctx = {}) => {
  const settings = new Settings(ctx)
  const getConfig = className => Object.assign({className}, settings)
  const config = getConfig()

  const _class = new Class(config)
  const event = new Event(config)
  const endpoint = new Endpoint(config)
  const channel = new Channel(config)
  const socket = new Socket(config)
  const trace = new Trace(config)
  const hosting = new Hosting(config)
  const response = new Response(config)
  const account = new Account(config)
  const instance = new Instance(config)
  const logger = new Logger(config)

  return {
    _class,
    users: new Proxy(
      {},
      {
        get(target, prop) {
          return new Users(config)[prop];
        }
      }
    ),
    account,
    instance,
    event,
    endpoint,
    channel,
    socket,
    trace,
    hosting,
    response,
    logger,
    data: new Proxy(new Data(settings), {
      get (target, className) {
        return new Data(getConfig(className))
      }
    })
  }
}

export default server
