import { spawn } from 'node:child_process'
import net from 'node:net'
import { resolve } from 'node:path'
import process from 'node:process'
import waitOn from 'wait-on'

const viteCli = resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js')
const electronCli = resolve(process.cwd(), 'node_modules', 'electron', 'cli.js')

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer()

    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      if (address && typeof address === 'object') {
        const { port } = address
        server.close(() => resolve(port))
      } else {
        server.close(() => reject(new Error('Unable to get a free port')))
      }
    })
  })
}

const port = await getFreePort()
const viteUrl = `http://127.0.0.1:${port}`
let electronProcess

const viteProcess = spawn(process.execPath, [viteCli, '--port', String(port), '--strictPort'], {
  stdio: 'inherit',
})

const shutdown = () => {
  viteProcess.kill()
  if (electronProcess) {
    electronProcess.kill()
  }
}

process.on('exit', shutdown)
process.on('SIGINT', () => {
  shutdown()
  process.exit(130)
})
process.on('SIGTERM', () => {
  shutdown()
  process.exit(143)
})

await waitOn({
  resources: [viteUrl],
  timeout: 30000,
  interval: 200,
})

electronProcess = spawn(process.execPath, [electronCli, '.'], {
  stdio: 'inherit',
  shell: false,
  env: {
    ...process.env,
    VITE_DEV_SERVER_URL: viteUrl,
  },
})

const exitCode = await new Promise((resolve) => {
  electronProcess.on('exit', resolve)
})

viteProcess.kill()
process.exit(typeof exitCode === 'number' ? exitCode : 0)