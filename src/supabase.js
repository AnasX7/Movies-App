import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const updateSearchCount = async (search, movie) => {
  try {
    // Check if a record with the given search already exists.
    const { data, error } = await supabase
      .from('metrics')
      .select('*')
      .eq('search', search)

    if (error) {
      throw error
    }

    if (data && data.length > 0) {
      // If it exists, update the count by incrementing it.
      const record = data[0]
      const { error: updateError } = await supabase
        .from('metrics')
        .update({ count: record.count + 1 })
        .eq('search', search)

      if (updateError) {
        throw updateError
      }
    } else {
      // If it doesn't exist, insert a new record with a count of 1.
      const { error: insertError } = await supabase.from('metrics').insert([
        {
          search,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        },
      ])

      if (insertError) {
        throw insertError
      }
    }
  } catch (err) {
    console.error('Error in updateSearchCount:', err)
  }
}

export const getTrendingMovies = async () => {
  try {
    const { data, error } = await supabase
      .from('metrics')
      .select('*')
      .order('count', { ascending: false })
      .limit(5)

    if (error) {
      throw error
    }

    return data
  } catch (err) {
    console.error('Error in getTrendingMovies:', err)
  }
}
