import format from 'chalk'
import { error, echo, echon } from '../utils/print-tools'

export default class SocketSubmitCmd {
  constructor (context) {
    this.session = context.session
    this.Socket = context.Socket
  }

  async run ([socketName, cmd]) {
    const availabeVerionTypes = [
      'major', 'premajor', 'minor', 'preminor', 'patch', 'prepatch', 'prerelease'
    ]
    if (cmd.bump && availabeVerionTypes.indexOf(cmd.bump) === -1) {
      echo()
      echo(4)(`Wrong version type: ${format.cyan(cmd.bump)}`)
      echo(4)(`Choose from: ${availabeVerionTypes.join(', ')}`)
      echo()
      process.exit()
    }

    this.socket = await this.Socket.getLocal(socketName)

    if (!this.socket.existLocally) {
      echo()
      error(4)(`Socket ${format.cyan(socketName)} cannot be found!`)
      echo()
      process.exit(1)
    }

    if (cmd.bump) {
      this.socket.bumpVersion(cmd.bump)
    }

    echo()
    echon(4)(`Submitting Socket ${format.cyan(this.socket.name)} `)
    echon(format.dim(`(${this.socket.spec.version})... `))

    try {
      const submitStatus = await this.socket.submit()
      if (submitStatus.status === 200) {
        const publishCommand = format.cyan('syncano-cli publish', this.socket.name)
        echo(format.green('Done!'))
        echon(4)('By default your socket is private 🔒. ')
        echo(`Type ${publishCommand} to make it available for everyone!`)
        echo()
      }
    } catch (err) {
      if (err.response && err.response.data) {
        error(4)(err.response.data.message)
        echo()
      } else {
        error(4)(err.message)
      }
      process.exit(1)
    }
  }
}
