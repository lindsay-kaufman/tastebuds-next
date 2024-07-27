import {
  APIProvider,
  AdvancedMarker,
  ControlPosition,
  Map,
} from "@vis.gl/react-google-maps";
import { CustomMapControl } from "./map-control";
import { useEffect, useState } from "react";
import MapBoundsHandler from "./map-bounds-handler";

const handleGetPositionError = (error: unknown) => {
  console.error(error);
};

interface NewMapProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export const NewMap = ({ onPlaceSelect }: NewMapProps) => {
  const position = { lat: 53.54992, lng: 10.00678 };
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  const [userPosition, setUserPosition] =
    useState<google.maps.LatLngLiteral | null>(null);

  const [positionError, setPositionError] = useState<Error | null>(null);

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
  }, []);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY || ""}>
      <Map defaultCenter={position} defaultZoom={10} mapId={"983392b9d828d2e3"}>
        <AdvancedMarker position={position} />

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
      </Map>

      <MapBoundsHandler place={selectedPlace} />
    </APIProvider>
  );
};
