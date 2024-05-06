import './App.css';
import { Routes,Route} from 'react-router-dom'
import Header from './components/header/Header';
import Home from '../src/pages/home/Home'
import MovieList from '../src/pages/movieList/MoveList'
import Movie from '../src/pages/movieDetail/Movie'
import SignUp from './pages/signUp/SignUp';
import SignIn from './pages/signIn/SignIn';
import RequireAuth from './components/requireAuth/RequireAuth';
import Favourite from './pages/favourite/Favourite';
import Recommend from './pages/recommend/Recommend';

function App() {
  return (
    <div className="App">
      <Header/>
        <Routes>
            <Route index element={<Home/>}></Route>
            <Route path="movie/:id" element={<Movie/>}></Route>
            <Route path="movies/:type" element={<MovieList/>}></Route>

            <Route path="signup/" element={<SignUp/>}></Route>
            <Route path="signin/" element={<SignIn/>}></Route>
           
            <Route element={<RequireAuth/>}>
              <Route path="favourite/" element={<Favourite/>}></Route>
              <Route path="recommend/" element={<Recommend/>}></Route>
            </Route>

            <Route path="/*" element={<h1>404 Not found</h1>}></Route>
            <Route path="/server/error" element={<h1>500 Internal Server Error</h1>}></Route>
        </Routes>
    </div>
  );
}

export default App;
