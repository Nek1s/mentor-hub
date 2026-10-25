import { useState, type ReactNode } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import LogoutRounded from '@mui/icons-material/LogoutRounded'
import MenuRounded from '@mui/icons-material/MenuRounded'
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { useAuth } from '../../app/providers/useAuth'

type AppShellProps = {
  children: ReactNode
}

const navigation = [
  { label: 'Главная', to: '/dashboard' },
  { label: 'Наставники', to: '/mentors' },
  { label: 'Расписание', to: '/schedule' },
  { label: 'Заметки', to: '/notes' },
  { label: 'Профиль', to: '/profile' },
]

export function AppShell({ children }: AppShellProps) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary">
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 64 }}>
            <Typography component={RouterLink} to="/dashboard" variant="h6" sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 700 }}>
              MentorHub
            </Typography>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, ml: 'auto' }}>
              {navigation.map((item) => (
                <Button
                  component={RouterLink}
                  to={item.to}
                  key={item.to}
                  color="inherit"
                  variant={pathname === item.to ? 'outlined' : 'text'}
                  sx={{ borderColor: pathname === item.to ? 'rgba(255,255,255,0.7)' : 'transparent' }}
                >
                  {item.label}
                </Button>
              ))}
              <Button color="inherit" startIcon={<LogoutRounded />} onClick={() => void handleSignOut()}>
                Выйти
              </Button>
            </Box>

            <IconButton color="inherit" onClick={(event) => setMenuAnchor(event.currentTarget)} aria-label="Открыть меню" sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}>
              <MenuRounded />
            </IconButton>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
              {navigation.map((item) => (
                <MenuItem component={RouterLink} to={item.to} key={item.to} selected={pathname === item.to} onClick={() => setMenuAnchor(null)}>
                  {item.label}
                </MenuItem>
              ))}
              <MenuItem onClick={() => { setMenuAnchor(null); void handleSignOut() }}>
                <LogoutRounded fontSize="small" />
                <Typography component="span" sx={{ ml: 1 }}>Выйти</Typography>
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      <Container component="main" maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {children}
      </Container>
    </Box>
  )
}
