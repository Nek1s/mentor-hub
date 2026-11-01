import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from 'playwright-core'

const appUrl = process.env.APP_URL ?? 'http://127.0.0.1:5173'
const outputDirectory = join('docs', 'screenshots')
const executablePath = [process.env.CHROME_PATH, 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'].filter(Boolean).find(existsSync)
if (!executablePath) throw new Error('Не найден Chrome или Edge. Укажите путь в CHROME_PATH.')

await mkdir(outputDirectory, { recursive: true })
const browser = await chromium.launch({ executablePath, headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 })
const user = { id: 1, full_name: 'Никита Иванов', email: 'nikita.ivanov@example.com', role: 'student', student_id: 1, created_at: '2026-01-01T00:00:00Z' }
const mentors = [{ id: 1, full_name: 'Артем Ребриков', specialization: 'Frontend-разработка', company: 'Учебный проект', bio: 'Помогаю начинающим разработчикам.', is_active: true }]
const appointments = [{ id: 1, student_id: 1, mentor_id: 1, scheduled_at: '2099-01-15T12:00:00Z', duration_minutes: 45, status: 'requested', topic: 'Разбор портфолио' }]
const notes = [{ id: 1, student_id: 1, appointment_id: null, title: 'Подготовка к встрече', content: 'Собрать вопросы для наставника.', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }]

try {
  await page.route('**/api/v1/**', async (route) => {
    const path = new URL(route.request().url()).pathname
    let body
    if (path.endsWith('/auth/me')) body = user
    else if (path.endsWith('/mentors')) body = mentors
    else if (path.endsWith('/appointments')) body = appointments
    else if (path.endsWith('/notes')) body = notes
    else if (path.endsWith('/students/1')) body = { ...user, goal: 'Подготовить портфолио', updated_at: user.created_at }
    else return route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ detail: 'Тестовый маршрут не настроен' }) })
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify(body) })
  })

  for (const name of ['login', 'register']) {
    await page.goto(`${appUrl}/${name}`, { waitUntil: 'networkidle' })
    await page.screenshot({ path: join(outputDirectory, `${name}.png`), fullPage: true })
    console.log(`Сохранён скриншот: ${name}`)
  }
  await page.addInitScript(() => {
    localStorage.setItem('mentorhub_access_token', 'demo-access-token')
    localStorage.setItem('mentorhub_refresh_token', 'demo-refresh-token')
  })
  for (const name of ['dashboard', 'mentors', 'schedule', 'notes', 'profile']) {
    await page.goto(`${appUrl}/${name}`, { waitUntil: 'networkidle' })
    await page.screenshot({ path: join(outputDirectory, `${name}.png`), fullPage: true })
    console.log(`Сохранён скриншот: ${name}`)
  }
  await page.goto(`${appUrl}/notes`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Новая заметка' }).click()
  await page.screenshot({ path: join(outputDirectory, 'notes-form.png'), fullPage: true })
  await page.goto(`${appUrl}/schedule`, { waitUntil: 'networkidle' })
  await page.getByLabel('Дата и время').fill('2000-01-01T12:00')
  await page.getByLabel('Тема встречи').fill('Проверка записи')
  await page.getByLabel('Наставник').click()
  await page.getByRole('option', { name: 'Артем Ребриков' }).click()
  await page.getByRole('button', { name: 'Записаться', exact: true }).click()
  await page.getByText('Выберите дату и время в будущем.').waitFor()
  await page.screenshot({ path: join(outputDirectory, 'schedule-validation.png'), fullPage: true })
  await page.goto(`${appUrl}/mentors`, { waitUntil: 'networkidle' })
  await page.getByPlaceholder('Поиск по имени, направлению или компании').fill('Несуществующий наставник')
  await page.getByText('Ничего не нашли').waitFor()
  await page.screenshot({ path: join(outputDirectory, 'mentors-empty.png'), fullPage: true })
  console.log('Скриншоты и проверки состояний готовы. Ответы API были подменены.')
} finally {
  await browser.close()
}
