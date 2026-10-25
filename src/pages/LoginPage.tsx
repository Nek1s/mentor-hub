import { useState, type FormEvent } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from '../app/providers/useAuth'
import { ApiRequestError } from '../shared/api/auth'

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await signIn({ email, password })
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard'
      navigate(from, { replace: true })
    } catch (requestError) {
      setError(requestError instanceof ApiRequestError ? requestError.message : 'Не удалось выполнить вход.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', pt: { xs: 5, md: 9 } }}>
      <Typography variant="h4" fontWeight={700}>MentorHub</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.75 }}>Войдите, чтобы продолжить работу с профилем и записями.</Typography>
      <Paper component="form" variant="outlined" onSubmit={handleSubmit} sx={{ mt: 3, p: 3 }}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
          <TextField label="Пароль" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" inputProps={{ minLength: 8 }} />
          <Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? 'Входим...' : 'Войти'}</Button>
        </Stack>
      </Paper>
      <Typography variant="body2" sx={{ mt: 2 }}>Нет аккаунта? <Link component={RouterLink} to="/register">Зарегистрироваться</Link></Typography>
    </Box>
  )
}
