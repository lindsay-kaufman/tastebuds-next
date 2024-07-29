import {
  APIProvider,
  AdvancedMarker,
  ControlPosition,
  Map,
} from "@vis.gl/react-google-maps";
import { CustomMapControl } from "./map-control";
import { useEffect, useState } from "react";
import MapBoundsHandler from "./map-bounds-handler";
import { getPlacesByUser } from "@/app/lib/api/places";
import { Place } from "@/app/lib/models/place";

const handleGetPositionError = (error: unknown) => {
  console.error(error);
};

interface NewMapProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}


export const NewMap = ({ onPlaceSelect }: NewMapProps) => {
  const defaultPosition: google.maps.LatLngLiteral = {
    lat: 42.3541,
    lng: -71.0701,
  };

  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  const [userPosition, setUserPosition] =
    useState<google.maps.LatLngLiteral>(defaultPosition);

  const [userPlaces, setUserPlaces] = useState<Place[]>([])

  const [positionError, setPositionError] = useState<Error | null>(null);

  const loadUserData = async () => {
    await getPlacesByUser(1).then((res) => {
      setUserPlaces(res);
    });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      handleGetPositionError,
      {
        timeout: 2000,
      }
    );

    loadUserData()
  }, []);


  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY || ""}>
      <Map defaultCenter={userPosition} defaultZoom={15} mapId={"983392b9d828d2e3"}>
        <AdvancedMarker position={userPosition} />

        <CustomMapControl
          controlPosition={ControlPosition.TOP}
          onPlaceSelect={setSelectedPlace}
        />

        {selectedPlace && (
          <AdvancedMarker
            position={{
              lat: selectedPlace.geometry?.location?.lat() ?? 0,
              lng: selectedPlace.geometry?.location?.lng() ?? 0,
            }}
          />
        )}

        {userPlaces.map(place => (
          <AdvancedMarker
            position={{
              lat: place.lat,
              lng: place.lng,
            }}
          />
        ))}

      </Map>

      <MapBoundsHandler place={selectedPlace} />
    </APIProvider>
  );
};
