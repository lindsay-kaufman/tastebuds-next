"use client";

import { Loader } from "@googlemaps/js-api-loader";
import React, { useEffect, useRef } from "react";

export const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      console.log("map init");

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");

      //init a marker
      const { Marker } = await loader.importLibrary('marker') as google.maps.MarkerLibrary;

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

      // setup map
      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

      // put marker on a map
      const marker = new Marker({
        map: map,
        position: position
      })
    };

    initMap();
  }, []);

  return <div style={{ height: "600px" }} ref={mapRef} />;
};
