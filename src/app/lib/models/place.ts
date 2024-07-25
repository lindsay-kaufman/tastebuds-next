export type Place = {
  id: number;
  name: string;
  description: string;
  lat: number;
  lng: number;
  user_id?: number;
  adr_formatted_address: string;
  icon: string;
  place_id: string;
  types: string[];
  url: string;
};

export type List = {
  name: string;
  ownerId: number;
}