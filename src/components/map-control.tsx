import { ControlPosition, MapControl } from "@vis.gl/react-google-maps";
import { PlaceAutocompleteClassic } from "./places-autocomplete";

type CustomAutocompleteControlProps = {
  controlPosition: ControlPosition;
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
};

export const CustomMapControl = ({
  controlPosition,
  onPlaceSelect,
}: CustomAutocompleteControlProps) => {
  return (
    <MapControl position={controlPosition}>
      <PlaceAutocompleteClassic onPlaceSelect={onPlaceSelect} />
    </MapControl>
  );
};
