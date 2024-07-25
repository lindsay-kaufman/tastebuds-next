"use client";

import { getPlacesByUser } from "@/app/lib/api/places";
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
  const tempLocation: Location = {
    lat: 42.3392,
    lng: -71.0809,
  };

  const initMap = async () => {
    console.log("map init");

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
      version: "weekly",
      libraries: ["places"],
    });

    const { Map } = await loader.importLibrary("maps");
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      "marker"
    )) as google.maps.MarkerLibrary;

    // initiate map
    const mapOptions: google.maps.MapOptions = {
      center: props.userLocation || null,
      zoom: 17,
      mapId: "MY_NEXTJS_MAPID",
    };

    const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

    // place user location on map
    const marker = new AdvancedMarkerElement({
      map: map,
      position: props.userLocation || tempLocation,
    });

    // autocomplete functionality for search bar
    const input = document.getElementById("search-input") as HTMLInputElement;
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Specify just the place data fields that you need.
    // const autocomplete = new google.maps.places.Autocomplete(input, {
    //   fields: ["place_id", "geometry", "formatted_address", "name"],
    // });

    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo("bounds", map);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = document.getElementById(
      "infowindow-content"
    ) as HTMLElement;

    infowindow.setContent(infowindowContent);

    //const mapMarker = new AdvancedMarkerElement({ map: map });

    // marker.addListener("click", () => {
    //   infowindow.open(map, mapMarker);
    // });

    autocomplete.addListener("place_changed", () => {
      console.log("place changed");
      infowindow.close();

      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      const location = new google.maps.LatLng(lat, lng);
      marker.position = location;

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(location);
        map.setZoom(17);
      }

      // const content =

      //infowindow.setContent(place.name, place.formatted_address)
      console.log("marker", marker);
      infowindow.open(map, marker);
    });

    // populate map with user places
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <input
        id="search-input"
        placeholder="Search..."
        style={{ borderColor: "red", marginBottom: "15px" }}
      />
      <div style={{ height: "600px" }} ref={mapRef} />
    </div>
  );
};

export const UserMap = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location>();

  const loadData = async () => {
    try {
      await getPlacesByUser(1).then((res) => {
        console.log("res:", res);
        setPlaces(res);
      });
    } catch (error) {
      console.log("Error fetching places", error);
    }
  };

  const options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: Infinity,
  };

  const onSuccess = (pos: GeolocationPosition) => {
    const crd = pos.coords;

    setCurrentLocation({
      lat: crd.latitude,
      lng: crd.longitude,
    });

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
  };

  const onError = (err: GeolocationPositionError) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  useEffect(() => {
    // set current location of the user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    }

    // load user places
    loadData();
  }, []);

  return <Map places={places} userLocation={currentLocation} />;
};
