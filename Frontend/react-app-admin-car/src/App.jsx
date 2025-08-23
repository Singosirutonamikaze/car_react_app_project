import { Component } from 'react'
import './index.css'
import UserProvider from '../context/userContext'
import { Routes, Route } from 'react-router-dom'
import Rout from './pages/Rout'
import Login from './auth/Login'
import DashboardPage from './pages/DashboardPage'
import ClientsPage from './pages/ClientsPage'
import CarsPage from './pages/CarsPage'
import SalesPage from './pages/SalesPage'
import CommandsPage from './pages/CommandsPage'

class App extends Component {

  render() {
    return (
      <UserProvider>
        <div>
          <Routes>
            <Route path="/" element={<Rout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/cars" element={<CarsPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/orders" element={<CommandsPage />} />
          </Routes>
        </div>
      </UserProvider>
    )
  }
}

export default App
