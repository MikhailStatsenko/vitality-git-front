import {Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import UsersPage from "./pages/UsersPage/UsersPage";
import RepositoriesPage from "./pages/RepositoriesPage/RepositoriesPage";
import RepositoryPage from "./pages/RepositoryPage/RepositoryPage";

function App() {
  return (
      <Routes>
        <Route path={'/login'} element={<LoginPage/>}/>
        <Route path={'/register'} element={<RegisterPage/>}/>

          <Route path={'/'} element={<UsersPage/>}/>
          <Route path={'/repositories/:username'} element={<RepositoriesPage/>} />
          <Route path={'/repositories/:username/*'} element={<RepositoryPage/>} />
      </Routes>
  );
}

export default App;
