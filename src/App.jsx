import { useEffect, useState } from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);



  const fetchMovies = async () => {

    setLoading(true);
    setErrorMsg('');

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok){
        throw new Error('Failed Fatching Movies')
      }

      const data = await response.json();

      if(data.Response === 'False'){
        setErrorMsg(data.Error || 'Failed To Fetch Movies');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || [] );

    } catch (error) {
      console.log(`Error Fetching Movies: ${error}`);
      setErrorMsg("Error Fetching Movies. Please Try Again Later.");
    } finally {
      setLoading (false);
    }
  };

  useEffect(() => {
    fetchMovies()
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero-bg.png" alt="HeroBG" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {loading ? (
            <Spinner></Spinner>
          ) : errorMsg ? (
            <p className="text-red-700">{errorMsg}</p>
          ) : (
            <ul>
              {
                movieList.map ((movie) => (
                  <p key={movie.id} className="text-white">{movie.title}</p>
                ))}
            </ul>
          )
        }
        </section>
      </div>
    </main>
  );
}

export default App;
