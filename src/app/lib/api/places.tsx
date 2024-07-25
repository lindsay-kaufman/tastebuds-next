'use server'

import { QueryData, createClient } from '@supabase/supabase-js'
import { Place } from '../models/place'

export const getPlacesByUser = async (userId: number) => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "")

  const getPlacesByUserIdQuery = supabase.from("places").select(`id, name, description, lng, lat, adr_formatted_address, icon, place_id, types, url`).eq('user_id', userId)

  type Places = QueryData<typeof getPlacesByUserIdQuery>

  const { data, error } = await getPlacesByUserIdQuery
    console.log("data", data)
  if (error) {
    throw error
  }

  const userPlaces: Places = data

  return userPlaces
}


export const createNewPlace = async (userId: never, placeData: Place) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  const { data, error } = await supabase
    .from('places')
    .insert([
      {
        user_id: userId,
        name: placeData.name,
        description: placeData.description,
        lng: placeData.lng,
        lat: placeData.lat,
        adr_formatted_address: placeData.adr_formatted_address,
        icon: placeData.icon,
        place_id: placeData.place_id,
        types: placeData.types,
        url: placeData.url
      }
    ]);

  if (error) {
    throw error;
  }

  return data;
};