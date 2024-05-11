"use client";

import { getPlacesByUser } from "@/app/lib/api/users";
import { Place } from "@/app/lib/models/place";
import { Loader } from "@googlemaps/js-api-loader";
import React, { useEffect, useRef, useState } from "react";

interface MapProps {
    places: Place[]
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
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    // TODO: get users current position
    const position = {
      lat: 42.33973,
      lng: -71.07792,
    };

    // map options
    const mapOptions: google.maps.MapOptions = {
      center: position,
      zoom: 17,
      mapId: "MY_NEXTJS_MAPID",
    };

    const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

    // change to user current position
    const marker = new AdvancedMarkerElement({
      map: map,
      position: position,
    });


    if (props.places.length > 0) {
        props.places.forEach((place) => {
          const marker = new AdvancedMarkerElement({
            position: { lat: place.lat, lng: place.lng },
            map: map
          });
        });
      }

    return map;
  };

  useEffect(() => {
    initMap();
  }, [props.places]);

  return <div style={{ height: "600px" }} ref={mapRef} />;
};


export const UserMap = () => {
    const [places, setPlaces] = useState<Place[]>([]);

    const loadData = async () => {
      await getPlacesByUser(1).then((res) => {
        console.log("res:", res);
        setPlaces(res);
      });
    };
  
    useEffect(() => {
      loadData()
    }, [])

    return (
        <Map places={places}/>
    )
}