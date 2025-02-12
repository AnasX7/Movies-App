

const Search = ({ search, setSearch }) => {
  return (
    <div className='search'>
      <div>
        <img src='./search.svg' alt='Search Icon' />

        <input
          type='text'
          placeholder='Search through thousands of movies'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  )
}

export default Search
