// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import NavigationBar from './components/NavigationBar';
import PageNotFound from './pages/PageNotFound';
import Countries from './pages/Countries';
import Login from './pages/Login';
import Register from './pages/Register';
import ApiHub from './pages/ApiHub';
import AdminKeyMgmt from './pages/AdminKeyMgmt';
import { useEffect, useState } from 'react';
import { useAuthContext } from './hooks/useAuthContext';


// APP
function App() {

  // CONSTANTS/VARIABLES
  const [role, setRole] = useState('user')
  const { user } = useAuthContext()

  // FETCHING USER TO FIND OUT ROLE
  useEffect(() => {
    const getUser = async () => {
        const id = localStorage.getItem('id')
        try {
          const response = await fetch('http://localhost:7000/user/single-user', {
              method: "POST",
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ id })
          })

          // CHECKING RESPONSE
          if (response.ok) {
              const data = await response.json()
              setRole(data.role)
          }
        } catch (error) {
          // HANDLING ERROR
          console.error(error)
        }
    }

    // ONLY RUNNING FUNCTION IF USER IS LOGGED IN
    if (user) {
      getUser()
    }
  }, [user])

  // RETURNING ROUTES WITH CONDITIONS (eg.: role, if logged in)
  return (
    <div className="App">
        <BrowserRouter>
          <NavigationBar role={ role }/>
          <Routes>
              <Route
                path='/'
                element={<Home />}
              />
              { user &&
                <Route
                  path='/countries'
                  element={<Countries />}
                />
              }
              { user &&
                <Route
                  path='/api'
                  element={<ApiHub />}
                />
              }
              <Route
                path='/login'
                element={<Login />}
              />
              <Route
                path='/register'
                element={<Register />}
              />
              {role && role === 'admin' &&
                <Route
                  path='/manage-keys'
                  element={<AdminKeyMgmt />}
                />
              }
              <Route
                path='/*'
                element={<PageNotFound />}
              />
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;

// END OF DOCUMENT --------------------------------------------------------------------------------