'use server'

import { QueryData, createClient } from '@supabase/supabase-js'

export const getPlacesByUser = async (userId: number) => {
  const supabase = createClient('process.env.NEXT_PUBLIC_SUPABASE_URL', 'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY')

  const getPlacesByUserIdQuery = supabase.from("places").select(`id, name, description, lng, lat`).eq('user_id', userId)

  type Places = QueryData<typeof getPlacesByUserIdQuery>

  const { data, error } = await getPlacesByUserIdQuery

  if (error) {
    throw error
  }

  const userPlaces: Places = data

  return userPlaces
}


