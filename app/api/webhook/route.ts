import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { exec } from 'child_process'

const SECRET = process.env.WEBHOOK_SECRET!
const APP_DIR = process.env.APP_DIR!
const BRANCH = process.env.DEPLOY_BRANCH || 'main'

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const signature = req.headers.get('x-hub-signature-256') || ''

  // Verify GitHub signature
  const expected = 'sha256=' + createHmac('sha256', SECRET).update(payload).digest('hex')
  const trusted = Buffer.from(expected)
  const received = Buffer.from(signature)

  if (trusted.length !== received.length || !timingSafeEqual(trusted, received)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  // Check branch
  const data = JSON.parse(payload)
  if (data.ref !== `refs/heads/${BRANCH}`) {
    return NextResponse.json({ message: `Not ${BRANCH} branch, skipping` })
  }
  let logs;
  // Run deploy.sh from inside the project directory
  exec(`${APP_DIR}/deploy.sh ${APP_DIR}`, (error, stdout, stderr) => {
    if (error) {
      console.error('Deploy error:', stderr);
      logs = stderr
    } else {
      console.log('Deploy output:', stdout)
      logs = stdout
    }

  })

  return NextResponse.json({ message: 'Deploy triggered', app: APP_DIR, logs: logs })
}
