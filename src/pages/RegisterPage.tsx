import { useState, type FormEvent } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from '../app/providers/useAuth'
import { ApiRequestError } from '../shared/api/auth'

export function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [goal, setGoal] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (password !== passwordConfirmation) {
      setError('Пароли не совпадают.')
      return
    }

    setIsSubmitting(true)
    try {
      await signUp({ full_name: fullName, email, password, goal: goal || undefined })
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(requestError instanceof ApiRequestError ? requestError.message : 'Не удалось зарегистрироваться.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 460, mx: 'auto', py: { xs: 4, md: 7 } }}>
      <Typography variant="h4" fontWeight={700}>Регистрация</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.75 }}>Создайте профиль ученика в MentorHub.</Typography>
      <Paper component="form" variant="outlined" onSubmit={handleSubmit} sx={{ mt: 3, p: 3 }}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Имя и фамилия" value={fullName} onChange={(event) => setFullName(event.target.value)} required inputProps={{ minLength: 2 }} />
          <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
          <TextField label="Цель" value={goal} onChange={(event) => setGoal(event.target.value)} multiline minRows={2} inputProps={{ maxLength: 2000 }} />
          <TextField label="Пароль" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="new-password" inputProps={{ minLength: 8 }} helperText="Не менее 8 символов" />
          <TextField label="Повторите пароль" type="password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} required autoComplete="new-password" inputProps={{ minLength: 8 }} />
          <Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? 'Создаём аккаунт...' : 'Зарегистрироваться'}</Button>
        </Stack>
      </Paper>
      <Typography variant="body2" sx={{ mt: 2 }}>Уже есть аккаунт? <Link component={RouterLink} to="/login">Войти</Link></Typography>
    </Box>
  )
}
