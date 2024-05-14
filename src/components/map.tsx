"use client";

import { getPlacesByUser } from "@/app/lib/api/users";
import { Place } from "@/app/lib/models/place";
import { Loader } from "@googlemaps/js-api-loader";
import React, { useEffect, useRef, useState } from "react";

interface MapProps {
  places: Place[];
  userLocation?: Location;
}

interface Location {
  lat: number;
  lng: number;
}

export const Map = (props: MapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  
  const initMap = async () => {
    console.log("map init");

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
      version: "weekly",
    });

    const { Map } = await loader.importLibrary("maps");
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      "marker"
    )) as google.maps.MarkerLibrary;

    const mapOptions: google.maps.MapOptions = {
      center: props.userLocation || null,
      zoom: 17,
      mapId: "MY_NEXTJS_MAPID",
    };

    const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

    const marker = new AdvancedMarkerElement({
      map: map,
      position: props.userLocation,
    });

    if (props.places.length > 0) {
      props.places.forEach((place) => {
        const marker = new AdvancedMarkerElement({
          position: { lat: place.lat, lng: place.lng },
          map: map,
          title: place.name,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: place.description,
        });

        marker.addListener("click", () => {
          infoWindow.open({
            anchor: marker,
            map,
          });
        });
      });
    }

    return map;
  };

  
  useEffect(() => {
    initMap();
  }, [props.places, props.userLocation]);

  return props.userLocation ? (
    <div style={{ height: "600px" }} ref={mapRef} />
  ) : (
    <div>...cannot access location</div>
  )
};

export const UserMap = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location>();

  const loadData = async () => {
    await getPlacesByUser(1).then((res) => {
      console.log("res:", res);
      setPlaces(res);
    });
  };

  const options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: Infinity
  };
  
   const onSuccess = (pos: GeolocationPosition) => {
    clearTimeout(5000)
    const crd = pos.coords;
  
    setCurrentLocation({
      lat: crd.latitude,
      lng: crd.longitude,
    });

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
  }
  
  const onError = (err: GeolocationPositionError) => {
    clearTimeout(5000)
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  useEffect(() => {

    // set current location of the user
    if (navigator.geolocation) {
        setTimeout("geoLocation", 5000)
        navigator.geolocation.getCurrentPosition(onSuccess, onError, options)
    }

    // load user places
    loadData();
  }, []);

  return <Map places={places} userLocation={currentLocation} />;
};
