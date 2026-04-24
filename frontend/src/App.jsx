import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout   from './components/Layout'
import Login    from './pages/Login'
import Orders   from './pages/Orders'
import Routes_  from './pages/Routes'
import Resources from './pages/Resources'
import Schedule from './pages/Schedule'

function Guard({ children }) {
  return localStorage.getItem('token')
    ? <Layout>{children}</Layout>
    : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"     element={<Login />} />
        <Route path="/orders"    element={<Guard><Orders /></Guard>} />
        <Route path="/routes"    element={<Guard><Routes_ /></Guard>} />
        <Route path="/resources" element={<Guard><Resources /></Guard>} />
        <Route path="/schedule"  element={<Guard><Schedule /></Guard>} />
        <Route path="*"          element={<Navigate to="/orders" replace />} />
      </Routes>
    </BrowserRouter>
  )
}