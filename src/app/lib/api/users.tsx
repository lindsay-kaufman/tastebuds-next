'use server'

import { QueryData, createClient } from '@supabase/supabase-js'

export const getPlacesByUser = async (userId: number) => {
  //const supabase = createClient('process.env.NEXT_PUBLIC_SUPABASE_URL', 'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
  const supabase = createClient('https://mntnrxhyshxqxyvlefxe.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udG5yeGh5c2h4cXh5dmxlZnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM1MzI5NzUsImV4cCI6MjAxOTEwODk3NX0.GBfW1ORmYhM5uBLIYs_SbFlOzPoa6nwtIsYPOabKCtU')

  const getPlacesByUserIdQuery = supabase.from("places").select(`id, name, description, lng, lat`).eq('user_id', userId)

  type Places = QueryData<typeof getPlacesByUserIdQuery>

  const { data, error } = await getPlacesByUserIdQuery

  if (error) {
    throw error
  }

  const userPlaces: Places = data

  return userPlaces
}


