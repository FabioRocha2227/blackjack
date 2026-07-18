import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

const projectRoot = process.cwd()
const requiredPackages = ['electron', 'react', 'react-dom', 'vite', 'wait-on']

function hasInstalledDependencies() {
  return requiredPackages.every((packageName) => existsSync(resolve(projectRoot, 'node_modules', packageName)))
}

export async function ensureDependencies() {
  if (hasInstalledDependencies()) {
    return
  }

  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const installArgs = existsSync(resolve(projectRoot, 'package-lock.json')) ? ['ci'] : ['install']

  const installResult = spawnSync(npmCommand, installArgs, {
    cwd: projectRoot,
    env: process.env,
    stdio: 'inherit',
    shell: false,
  })

  if (installResult.error) {
    throw installResult.error
  }

  if (installResult.status !== 0) {
    process.exit(installResult.status ?? 1)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await ensureDependencies()
}