import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from 'playwright-core'

const appUrl = process.env.APP_URL ?? 'http://127.0.0.1:5173'
const outputDirectory = join('docs', 'screenshots')
const chromePaths = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean)
const executablePath = chromePaths.find((path) => existsSync(path))

if (!executablePath) {
  throw new Error('Не найден Chrome или Edge. Укажите путь в переменной CHROME_PATH.')
}

const pages = [
  ['dashboard', 'Главная'],
  ['mentors', 'Наставники'],
  ['schedule', 'Расписание'],
  ['notes', 'Заметки'],
]

await mkdir(outputDirectory, { recursive: true })

const browser = await chromium.launch({ executablePath, headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 })

try {
  for (const [route, title] of pages) {
    await page.goto(`${appUrl}/${route}`, { waitUntil: 'networkidle' })
    await page.screenshot({ path: join(outputDirectory, `${route}.png`), fullPage: true })
    console.log(`Сохранён скриншот: ${title}`)
  }
} finally {
  await browser.close()
}
