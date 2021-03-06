import os from 'os'
import Settings from './settings'
import logger from '../utils/debug'

const { debug } = logger('settings-account')

export default class AccountSettings extends Settings {
  constructor () {
    super()
    this.name = process.env.SYNCANO_ACCOUNT_FILE ? process.env.SYNCANO_ACCOUNT_FILE : 'syncano'
    this.baseDir = os.homedir()
    this.loaded = this.load()
  }

  logout () {
    debug('logout()')
    delete this.attributes.auth_key
    this.save()
  }

  authenticated () {
    return Boolean(this.getAuthKey())
  }

  getAuthKey () {
    return process.env.SYNCANO_AUTH_KEY || this.attributes.auth_key || null
  }

  addProject (projectName, params = {}) {
    debug('addProject()', projectName)
    if (!this.attributes.projects) {
      this.attributes.projects = {}
    }
    this.attributes.projects[projectName] = params
    this.save()
  }

  getProject (projectName) {
    debug('getProject()', projectName)
    const envInstance = process.env.SYNCANO_PROJECT_INSTANCE
    if (envInstance) {
      return { instance: envInstance }
    }
    if (this.attributes.projects) {
      return this.attributes.projects[projectName]
    }
  }
}
