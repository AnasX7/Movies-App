import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { getTrendingMovies, updateSearchCount } from './supabase'

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
}

const App = () => {
  const [debounceSearch, setDebounceSearch] = useState('')
  const [search, setSearch] = useState('')

  const [movieList, setMovieList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [trendingMovies, setTrendingMovies] = useState([])
  const [trendingMoviesLoading, setTrendingMoviesLoading] = useState(false)
  const [trendingMoviesErrorMessage, setTrendingMoviesErrorMessage] =
    useState('')

  useDebounce(() => setDebounceSearch(search), 500, [search])

  const fetchMovies = async (query = '') => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

      const response = await fetch(endpoint, API_OPTIONS)

      if (!response.ok) {
        throw new Error('Failed to fetch movies')
      }

      const data = await response.json()

      if (data.response === 'False') {
        setErrorMessage(data.error || 'Failed to fetch movies')
        setMovieList([])
        return
      }

      setMovieList(data.results || [])

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0])
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`)
      setErrorMessage('Error fetching movies. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTrendingMovies = async () => {
    setTrendingMoviesLoading(true)
    setTrendingMoviesErrorMessage('')

    try {
      const movies = await getTrendingMovies()
      setTrendingMovies(movies)
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`)
      setTrendingMoviesErrorMessage(
        'Error fetching trending movies. Please try again later.'
      )
    } finally {
      setTrendingMoviesLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies(debounceSearch)
  }, [debounceSearch])

  useEffect(() => {
    fetchTrendingMovies()
  }, [])

  return (
    <main className='overflow-x-hidden'>
      <div className='pattern' />

      <div className='wrapper'>
        <header>
          <img className='w-20 h-auto' src='./logo.png' alt='Logo' />
          <img className='hero-img' src='./hero-img.png' alt='Hero Banner' />
          <h1>
            Find <span className='text-gradient'>Movies</span> You&apos;ll Enjoy
            Without the Hassle
          </h1>
          <Search search={search} setSearch={setSearch} />
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>

            {trendingMoviesLoading ? (
              <Spinner />
            ) : trendingMoviesErrorMessage ? (
              <p className='text-red-500'>{trendingMoviesErrorMessage}</p>
            ) : (
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <section className='all-movies'>
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
