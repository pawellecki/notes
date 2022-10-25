import { Component, onMount } from 'solid-js';
import { Routes, Route, Navigate, useNavigate } from 'solid-app-router';
import { Toaster } from 'solid-toast';
import Notes from './pages/notes/notes';
import NewNote from './pages/newNote/newNote';
import EditNote from './pages/editNote/editNote';
import Info from './pages/info/info';
import Auth from './pages/auth/auth';
import { loggedInUser, setLoggedInUser } from '../globalStore';
import Button from './components/Button/Button';

const App: Component = () => {
  const navigate = useNavigate();

  const userData = localStorage.getItem('userData') ?? '';
  const { userId, email, token, expiration } =
    (userData && JSON.parse(userData)) ?? {};
  const isNotExpriedToken = new Date(expiration) > new Date();

  if (token && isNotExpriedToken) {
    setLoggedInUser({ userId, email, token });
  }

  const logout = () => {
    setLoggedInUser(undefined);
    localStorage.removeItem('userData');
  };

  onMount(() => {
    let logoutTimer;
    if (token && expiration) {
      const remainingTime =
        new Date(expiration).getTime() - new Date().getTime();

      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  });

  return (
    <div>
      <Toaster />
      {loggedInUser() && (
        <>
          <div class="appHeader">
            <p> {loggedInUser()?.email}</p>
            <Button className="whiteTextButton" variant="text" onClick={logout}>
              logout
            </Button>
            <span onClick={() => navigate('/info')}>?</span>
          </div>
          <Routes>
            <Route path="/" element={<Notes />} />
            <Route path="/notes/new" element={<NewNote />} />
            <Route path="/notes/:id" element={<EditNote />} />
            <Route path="/info" element={<Info />} />
          </Routes>
        </>
      )}

      {!loggedInUser() && (
        <Routes>
          <Route path="/:any">
            <Navigate href={'/'} />
          </Route>
          <Route path="/" element={<Auth />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
