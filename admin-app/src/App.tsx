import MenuManagement from './components/MenuManagement'
import './App.css'

function App() {
  return (
    <div style={{ minWidth:1280,fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        Admin Application
      </h1>
      {/* <AdminDashboard title="College Portal Admin Dashboard" /> */}
      {/* <UserManagement /> */}
      {/* <MenuList /> */}
      <MenuManagement />
    </div>
  )
}

export default App
