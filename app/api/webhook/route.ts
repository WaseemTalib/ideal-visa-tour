import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { exec } from 'child_process'
import { appendFileSync } from 'fs'

const SECRET = process.env.WEBHOOK_SECRET!
const APP_DIR = process.env.APP_DIR!
const BRANCH = process.env.DEPLOY_BRANCH || 'main'

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const signature = req.headers.get('x-hub-signature-256') || ''

  const expected = 'sha256=' + createHmac('sha256', SECRET).update(payload).digest('hex')
  const trusted = Buffer.from(expected)
  const received = Buffer.from(signature)

  if (trusted.length !== received.length || !timingSafeEqual(trusted, received)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const data = JSON.parse(payload)
  if (data.ref !== `refs/heads/${BRANCH}`) {
    return NextResponse.json({ message: `Not ${BRANCH} branch, skipping` })
  }

  const command = `bash ${APP_DIR}/deploy.sh ${APP_DIR}`
  
  // Log the command being run
  appendFileSync(`${APP_DIR}/deploy.log`, `\n=== Webhook received, running: ${command} ===\n`)

  exec(command, { uid: process.getuid?.() }, (error, stdout, stderr) => {
    appendFileSync(`${APP_DIR}/deploy.log`, `stdout: ${stdout}\nstderr: ${stderr}\n`)
    if (error) {
      appendFileSync(`${APP_DIR}/deploy.log`, `error: ${error.message}\n`)
    }
  })

  return NextResponse.json({ message: 'Deploy triggered===', app: APP_DIR })
}