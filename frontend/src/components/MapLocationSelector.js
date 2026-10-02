import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  Circle
} from '@react-google-maps/api';

import { useSecretKey } from '../security/SecretKeyContext';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '8px'
};

const defaultLocation = {
  lat: 28.6139,
  lng: 77.2090
};

function GoogleMapLocationSelector({
  formData,
  onLocationChange
}) {

  const { secretKey } = useSecretKey();

  const [position, setPosition] =
    useState(defaultLocation);

  const [mapCenter, setMapCenter] =
    useState(defaultLocation);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [gpsAccuracy, setGpsAccuracy] =
    useState(null);

  const [selectedRadius, setSelectedRadius] =
    useState(10);

  const [source, setSource] =
    useState('default');

  const [isPrimary, setIsPrimary] =
    useState(true);


  /*
   * =========================================
   * COMMON LOCATION DATA FUNCTION
   * =========================================
   */

  const createLocationData = ({
    locationPosition = position,
    locationSource = source,
    locationAccuracy = gpsAccuracy,
    locationRadius = selectedRadius,
    primary = isPrimary
  } = {}) => {

    if (!locationPosition) {
      return null;
    }

    return {
      latitude: Number(
        locationPosition.lat.toFixed(6)
      ),

      longitude: Number(
        locationPosition.lng.toFixed(6)
      ),

      gpsAccuracy:
        locationAccuracy !== null
          ? Math.round(locationAccuracy)
          : null,

      selectedRadius:
        Number(locationRadius),

      source:
        locationSource,

      capturedAt:
        new Date().toISOString(),

      isPrimary:
        primary
    };
  };


  /*
   * =========================================
   * SEND LOCATION TO PARENT
   * =========================================
   */

  const updateLocation = ({
    locationPosition = position,
    locationSource = source,
    locationAccuracy = gpsAccuracy,
    locationRadius = selectedRadius,
    primary = isPrimary
  } = {}) => {

    const locationData =
      createLocationData({
        locationPosition,
        locationSource,
        locationAccuracy,
        locationRadius,
        primary
      });

    if (locationData) {
      onLocationChange(locationData);
    }
  };


  /*
   * =========================================
   * GET CURRENT LOCATION ON OPEN
   * =========================================
   */

  useEffect(() => {
    handleGetCurrentLocation();
  }, []);


  /*
   * =========================================
   * CURRENT GPS LOCATION
   * =========================================
   */

  const handleGetCurrentLocation = () => {

    if (!navigator.geolocation) {

      setError(
        'Aapka browser Geolocation support nahi karta.'
      );

      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(

      (pos) => {

        const {
          latitude,
          longitude,
          accuracy
        } = pos.coords;

        const currentPos = {
          lat: latitude,
          lng: longitude
        };


        /*
         * Update states
         */

        setPosition(currentPos);

        setMapCenter(currentPos);

        setGpsAccuracy(accuracy);

        setSource('gps');

        setLoading(false);


        /*
         * IMPORTANT:
         * Direct currentPos use kar rahe hain.
         * Isse old position state ki problem nahi hogi.
         */

        updateLocation({
          locationPosition: currentPos,
          locationSource: 'gps',
          locationAccuracy: accuracy
        });

      },


      (err) => {

        console.error(
          'Geolocation Error:',
          err
        );

        let message = '';

        switch (err.code) {

          case err.PERMISSION_DENIED:

            message =
              'Location permission deny hai. Browser settings mein location permission allow karein.';

            break;


          case err.POSITION_UNAVAILABLE:

            message =
              'Current location available nahi hai. GPS/Location ON karke dobara try karein.';

            break;


          case err.TIMEOUT:

            message =
              'GPS location detect karne mein timeout ho gaya. Dobara try karein.';

            break;


          default:

            message =
              `Location error: ${err.message}`;
        }

        setError(message);

        setLoading(false);
      },


      {
        enableHighAccuracy: true,
        timeout: 60000,
        maximumAge: 0
      }
    );
  };


  /*
   * =========================================
   * MAP CLICK
   * =========================================
   */

  const handleMapClick = (event) => {

    if (!event.latLng) {
      return;
    }

    const clickedPos = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };


    /*
     * Update state
     */

    setPosition(clickedPos);

    setMapCenter(clickedPos);

    setSource('map');


    /*
     * Send NEW clicked position
     */

    updateLocation({
      locationPosition: clickedPos,
      locationSource: 'map',
      locationAccuracy: gpsAccuracy
    });
  };


  /*
   * =========================================
   * MARKER DRAG
   * =========================================
   */

  const handleMarkerDragEnd = (event) => {

    if (!event.latLng) {
      return;
    }

    const draggedPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };


    /*
     * Update state
     */

    setPosition(draggedPosition);

    setMapCenter(draggedPosition);

    setSource('map');


    /*
     * Send NEW dragged position
     */

    updateLocation({
      locationPosition: draggedPosition,
      locationSource: 'map',
      locationAccuracy: gpsAccuracy
    });
  };


  /*
   * =========================================
   * RADIUS CHANGE
   * =========================================
   */

  const handleRadiusChange = (event) => {

    const radius =
      Number(event.target.value);

    setSelectedRadius(radius);


    /*
     * Send updated radius
     */

    updateLocation({
      locationPosition: position,
      locationSource: source,
      locationAccuracy: gpsAccuracy,
      locationRadius: radius
    });
  };


  /*
   * =========================================
   * PRIMARY LOCATION CHANGE
   * =========================================
   */

  const handlePrimaryChange = (event) => {

    const primary =
      event.target.checked;

    setIsPrimary(primary);


    /*
     * Send updated primary status
     */

    updateLocation({
      locationPosition: position,
      locationSource: source,
      locationAccuracy: gpsAccuracy,
      locationRadius: selectedRadius,
      primary
    });
  };


  /*
   * =========================================
   * RENDER
   * =========================================
   */

  return (
    <div className="location-selector-container">

      <div className="location-selector-row">


        {/* =================================
            LEFT PANEL
        ================================== */}

        <div className="location-save-panel">


          {/* INFORMATION */}

          <div className="card border-0 bg-light mb-3">

            <div className="card-body py-2 px-3">


              {/* Latitude */}

              <div className="row align-items-center py-2 border-bottom">

                <div className="col-5">

                  <span className="text-secondary small">
                    Latitude
                  </span>

                </div>

                <div className="col-7 text-end">

                  <span className="fw-semibold small text-dark">

                    {position.lat.toFixed(6)}

                  </span>

                </div>

              </div>


              {/* Longitude */}

              <div className="row align-items-center py-2 border-bottom">

                <div className="col-5">

                  <span className="text-secondary small">
                    Longitude
                  </span>

                </div>

                <div className="col-7 text-end">

                  <span className="fw-semibold small text-dark">

                    {position.lng.toFixed(6)}

                  </span>

                </div>

              </div>


              {/* Source */}

              <div className="row align-items-center py-2 border-bottom">

                <div className="col-5">

                  <span className="text-secondary small">
                    Source
                  </span>

                </div>

                <div className="col-7 text-end">

                  <span
                    className={
                      `badge ${
                        source === 'gps'
                          ? 'text-bg-success'
                          : source === 'map'
                          ? 'text-bg-primary'
                          : 'text-bg-secondary'
                      }`
                    }
                  >

                    {source === 'gps'
                      ? '📍 GPS'
                      : source === 'map'
                      ? '🗺️ Map'
                      : 'Default'}

                  </span>

                </div>

              </div>


              {/* GPS Accuracy */}

              <div className="row align-items-center py-2">

                <div className="col-5">

                  <span className="text-secondary small">
                    GPS Accuracy
                  </span>

                </div>

                <div className="col-7 text-end">

                  <span
                    className={
                      `fw-semibold small ${
                        gpsAccuracy !== null
                          ? 'text-success'
                          : 'text-secondary'
                      }`
                    }
                  >

                    {gpsAccuracy !== null
                      ? `${Math.round(
                          gpsAccuracy
                        )} meters`
                      : 'N/A'}

                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* =================================
              RADIUS
          ================================== */}

          <div className="radius-section">

            <div className="radius-header">

              <strong>
                📏 Location Radius
              </strong>

              <span className="radius-value">

                {selectedRadius} m

              </span>

            </div>


            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={selectedRadius}
              onChange={handleRadiusChange}
              className="radius-range"
            />


            <div className="radius-labels">

              <span>
                10m
              </span>

              <span>
                500m
              </span>

            </div>

          </div>


          {/* =================================
              PRIMARY LOCATION
          ================================== */}

          <label className="primary-location">

            <input
              type="checkbox"
              checked={isPrimary}
              onChange={handlePrimaryChange}
            />

            <span>
              Set as Primary Location
            </span>

          </label>


        </div>


        {/* =================================
            RIGHT MAP PANEL
        ================================== */}

        <div className="location-map-panel">


          {/* CURRENT LOCATION BUTTON */}

          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={loading}
            className={
              `current-location-btn ${
                loading ? 'loading' : ''
              }`
            }
          >

            {loading
              ? '📍 Detecting Location...'
              : '📍 Get Current Location'}

          </button>


          {/* ERROR */}

          {error && (

            <div className="location-error">

              {error}

            </div>

          )}


          {/* DESCRIPTION */}

          <p className="map-description">

            Red marker ko drag karein ya
            map par click karke location
            select karein.

          </p>


          {/* MAP */}

          <div className="map-wrapper">

            <LoadScript
              googleMapsApiKey={secretKey}
              loadingElement={
                <div className="map-loading">
                  Loading Google Maps...
                </div>
              }
            >

              <GoogleMap

                mapContainerStyle={
                  containerStyle
                }

                center={mapCenter}

                zoom={17}

                onClick={handleMapClick}

              >


                {/* RED MARKER */}

                {position && (

                  <Marker

                    position={position}

                    draggable={true}

                    onDragEnd={
                      handleMarkerDragEnd
                    }

                  />

                )}


                {/* RED RADIUS CIRCLE */}

                {position && (

                  <Circle

                    center={position}

                    radius={selectedRadius}

                    options={{

                      strokeColor:
                        '#ff0000',

                      strokeOpacity:
                        0.8,

                      strokeWeight:
                        2,

                      fillColor:
                        '#ff0000',

                      fillOpacity:
                        0.15,

                      clickable:
                        false,

                      draggable:
                        false,

                      editable:
                        false

                    }}

                  />

                )}

              </GoogleMap>

            </LoadScript>

          </div>

        </div>

      </div>


      {/* =====================================
          RESPONSIVE STYLE
      ====================================== */}

      <style>
        {`

          .location-selector-container {
            width: 100%;
            height: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 10px 20px;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .location-selector-row {
            width: 100%;
            flex: 1;
            min-height: 0;
            display: grid;
            grid-template-columns:
              minmax(300px, 0.8fr)
              minmax(400px, 1.2fr);
            gap: 15px;
            align-items: stretch;
            overflow: hidden;
          }

          .location-save-panel {
            background: #ffffff;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 15px;
            box-sizing: border-box;
            height: 100%;
            overflow-y: auto;
            min-height: 0;
          }

          .current-location-btn {
            width: 100%;
            padding: 11px;
            background: #28a745;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 12px;
            transition: .2s;
          }

          .current-location-btn:hover {
            background: #218838;
          }

          .current-location-btn.loading {
            background: #aaa;
            cursor: not-allowed;
          }

          .location-error {
            background: #f8d7da;
            color: #842029;
            padding: 9px;
            border-radius: 5px;
            margin-bottom: 12px;
            font-size: 12px;
          }

          .radius-section {
            background: #fff3cd;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #ffeeba;
            margin-bottom: 12px;
          }

          .radius-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2px;
            font-size: 13px;
          }

          .radius-value {
            background: #dc3545;
            color: #fff;
            padding: 3px 7px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
          }

          .radius-range {
            width: 100%;
            cursor: pointer;
          }

          .radius-labels {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #666;
            margin-top: 3px;
          }

          .primary-location {
            display: flex;
            align-items: center;
            gap: 7px;
            padding: 9px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin-bottom: 12px;
            cursor: pointer;
            font-size: 13px;
          }

          .primary-location input {
            cursor: pointer;
          }

          .location-map-panel {
            background: #ffffff;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 10px;
            box-sizing: border-box;
            height: 100%;
            min-height: 0;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .map-description {
            flex-shrink: 0;
            margin: 0 10px 8px 10px;
            font-size: 12px;
            color: #666;
          }

          .map-wrapper {
            flex: 1;
            min-height: 0;
            width: 100%;
            overflow: hidden;
            border-radius: 8px;
          }

          .map-loading {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
            color: #666;
            border-radius: 8px;
          }

          @media (max-width: 768px) {

            .location-selector-container {
              height: 100%;
              padding: 8px 10px;
              overflow: auto;
            }

            .location-selector-row {
              grid-template-columns: 1fr;
              overflow: visible;
              flex: none;
            }

            .location-save-panel {
              height: auto;
              overflow: visible;
            }

            .location-map-panel {
              height: 450px;
              min-height: 450px;
            }

            .map-wrapper {
              min-height: 350px;
            }
          }

          @media (max-width: 480px) {

            .location-selector-container {
              padding: 6px 8px;
            }

            .location-selector-row {
              gap: 10px;
            }

            .location-save-panel {
              padding: 12px;
            }

            .location-map-panel {
              height: 400px;
              min-height: 400px;
              padding: 8px;
            }
          }

        `}
      </style>

    </div>
  );
}

export default GoogleMapLocationSelector;
