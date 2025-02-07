import { useState } from 'react'
import Search from './components/Search'

const App = () => {
  const [search, setSearch] = useState('')

  return (
    <main className='overflow-x-hidden'>
      <div className='pattern' />

      <div className='wrapper'>
        <header>
          <img src='./hero-img.png' alt='Hero Banner' />
          <h1>
            Find <span className='text-gradient'>Movies</span> You&apos;ll Enjoy
            Without the Hassle
          </h1>
        </header>

        <Search search={search} setSearch={setSearch} />
      </div>
    </main>
  )
}

export default App
