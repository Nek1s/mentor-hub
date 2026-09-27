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
    await page.waitForTimeout(600)
    await page.screenshot({ path: join(outputDirectory, `${route}.png`), fullPage: true })
    console.log(`Сохранён скриншот: ${title}`)
  }

  await page.goto(`${appUrl}/notes`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await page.getByRole('button', { name: 'Новая заметка' }).click()
  await page.waitForTimeout(350)
  await page.screenshot({ path: join(outputDirectory, 'notes-form.png'), fullPage: true })
  console.log('Сохранён скриншот: форма заметки')

  await page.goto(`${appUrl}/schedule`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await page.getByRole('button', { name: 'Записаться на встречу' }).click()
  await page.screenshot({ path: join(outputDirectory, 'schedule-validation.png'), fullPage: true })
  console.log('Сохранён скриншот: ошибки формы записи')

  await page.goto(`${appUrl}/mentors`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await page.getByPlaceholder('Поиск по имени, навыку или роли').fill('Несуществующий наставник')
  await page.screenshot({ path: join(outputDirectory, 'mentors-empty.png'), fullPage: true })
  console.log('Сохранён скриншот: пустой результат поиска')

  await page.goto(`${appUrl}/notes`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await page.getByRole('button', { name: 'Новая заметка' }).click()
  await page.getByLabel('Заголовок').fill('Проверочная заметка')
  await page.getByLabel('Текст заметки').fill('Проверяем создание заметки в общем состоянии приложения.')
  await page.getByRole('button', { name: 'Сохранить' }).click()
  await page.getByText('Проверочная заметка').first().waitFor()
  console.log('Проверен сценарий: создание заметки')

  await page.goto(`${appUrl}/schedule`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await page.getByRole('button', { name: '18:30' }).click()
  await page.getByLabel('Тема встречи').fill('Проверка записи')
  await page.getByRole('button', { name: 'Записаться на встречу' }).click()
  await page.getByText('Время выбрано — заявка на встречу создана').waitFor()
  console.log('Проверен сценарий: создание встречи')
} finally {
  await browser.close()
}
