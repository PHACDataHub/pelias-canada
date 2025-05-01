import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Overlay from 'ol/Overlay';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import { useTranslation } from 'react-i18next';
import {
  GcdsHeading,
  GcdsSrOnly,
  GcdsText,
} from '@cdssnc/gcds-components-react';

export default function RevMapping({ filteredApiResults, originalPoints }) {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const overlayRef = useRef(null);

  // Responsive State for Wide Screen Check
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1080);

  // Handle Media Query Changes for Screen Width
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1080px)');
    const handleMediaChange = () => setIsWideScreen(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    const apiVectorSource = new VectorSource();
    const originalVectorSource = new VectorSource();
    const features = [];

    // Function to determine color based on confidence level
    const getColorByConfidence = (confidence) => {
      if (!confidence || typeof confidence !== 'number') return '#B22222';
      const confidenceValue = confidence * 100;
      if (confidenceValue >= 100) return '#006400';
      if (confidenceValue >= 80) return '#389638';
      if (confidenceValue >= 50) return '#FFBF00';
      if (confidenceValue >= 30) return '#FF8C00';
      return '#B22222';
    };

    // Add API results as colored points
    filteredApiResults.forEach((item) => {
      const confidence = item?.result?.properties?.confidence;
      const confidenceColor = getColorByConfidence(confidence);

      if (item?.result?.geometry?.coordinates) {
        const pointFeature = new Feature({
          geometry: new Point(
            fromLonLat([
              item.result.geometry.coordinates[0],
              item.result.geometry.coordinates[1],
            ]),
          ),
          data: item,
          type: 'apiPoint',
        });

        pointFeature.setStyle(
          new Style({
            image: new Circle({
              radius: 5,
              fill: new Fill({ color: confidenceColor }),
              stroke: new Stroke({ color: 'black', width: 1 }),
            }),
          }),
        );

        apiVectorSource.addFeature(pointFeature);
        features.push(pointFeature);
      }
    });

    // Add Original Points as Blue Dots
    originalPoints.forEach((point) => {
      if (point?.ddLong && point?.ddLat) {
        const bluePointFeature = new Feature({
          geometry: new Point(fromLonLat([point.ddLong, point.ddLat])),
          data: point,
          type: 'originalPoint',
        });

        bluePointFeature.setStyle(
          new Style({
            image: new Circle({
              radius: 5,
              fill: new Fill({ color: 'blue' }), // Always blue
              stroke: new Stroke({ color: 'black', width: 1 }),
            }),
          }),
        );

        originalVectorSource.addFeature(bluePointFeature);
        features.push(bluePointFeature);
      }
    });

    const apiVectorLayer = new VectorLayer({ source: apiVectorSource });
    const originalVectorLayer = new VectorLayer({
      source: originalVectorSource,
    });

    // Create the map
    const map = new Map({
      view: new View({
        center: fromLonLat([-73.568439, 45.494728]),
        zoom: 6,
      }),
      layers: [
        new TileLayer({ source: new OSM({ attributions: false }) }),
        apiVectorLayer,
        originalVectorLayer,
      ],
      target: mapRef.current,
    });

    // console.log("Added Features:", features)

    // Fit map to all points
    const extent = apiVectorSource
      .getExtent()
      .concat(originalVectorSource.getExtent());
    if (
      features.length > 0 &&
      extent[0] !== Infinity &&
      extent[1] !== Infinity
    ) {
      map.getView().fit(extent, {
        size: map.getSize(),
        padding: [50, 50, 50, 50],
        maxZoom: 14,
      });
    }

    // Create overlay for hover display
    const overlay = new Overlay({
      element: overlayRef.current,
      positioning: 'bottom-center',
      stopEvent: false,
    });
    map.addOverlay(overlay);

    map.on('pointermove', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feat) => feat);
      if (feature) {
        const coordinates = feature.getGeometry().getCoordinates();
        overlay.setPosition(coordinates);

        const data = feature.get('data');

        if (feature.get('type') === 'apiPoint') {
          overlayRef.current.innerHTML = `
                    <div>
                        <strong>${t('components.reverseBulk.outputTable.inputID')}:</strong> ${data.inputID} <br />
                        <strong>id ranking:</strong> ${data.featureIndex + 1} <br />
                        <strong>${t('components.reverseBulk.outputTable.address')}:</strong> ${data.result?.properties?.label || 'N/A'} <br />
                        <strong>${t('components.reverseBulk.outputTable.lat')}:</strong> ${data?.result?.geometry?.coordinates?.[1] ?? 'N/A'} <br />
                        <strong>${t('components.reverseBulk.outputTable.lon')}:</strong> ${data?.result?.geometry?.coordinates?.[0] ?? 'N/A'} <br />
                        <strong>${t('components.reverseBulk.outputTable.confidenceLevel')}:</strong> 
                        ${data?.result?.properties?.confidence !== undefined ? `${data.result.properties.confidence * 100}%` : 'N/A'} <br />
                        <strong>${t('components.reverseBulk.outputTable.distance')}:</strong> ${data?.result?.properties?.distance || 'N/A'} km <br />
                        <strong>${t('components.reverseBulk.outputTable.accuracy')}:</strong> ${data?.result?.properties?.accuracy || 'N/A'} <br />
                    </div>
                    `;
        } else if (feature.get('type') === 'originalPoint') {
          overlayRef.current.innerHTML = `
                        <div>
                            <strong>${t('components.reverseBulk.outputTable.inputID')}:</strong> ${data.inputID} <br />
                            <strong>${t('components.reverseBulk.outputTable.lat')}:</strong> ${data.ddLat} <br />
                            <strong>${t('components.reverseBulk.outputTable.lon')}:</strong> ${data.ddLong} <br />
                        </div>
                    `;
        }

        overlayRef.current.style.display = 'block';
      } else {
        overlay.setPosition(undefined);
        overlayRef.current.style.display = 'none';
      }
    });
    const addLegend = (t, isWideScreen) => {
      const legendContainer = document.createElement('div');
      legendContainer.style.position = 'absolute';
      legendContainer.style.bottom = '30px';
      legendContainer.style.right = '10px';
      legendContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
      legendContainer.style.padding = '5px';
      legendContainer.style.borderRadius = '5px';
      legendContainer.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
      legendContainer.style.fontSize = isWideScreen ? '16px' : '12px';
      legendContainer.style.lineHeight = '1.5em';

      legendContainer.innerHTML = `
        <div style="margin-bottom: 6px;">
        <strong>${t('legend.confidence')}</strong><br/>
          <i style="background: blue; width: 18px; height: 18px; display: inline-block; margin-right: 8px;"></i>
          <span>${t('legend.original')}</span>
        </div>
      `;

      const grades = [100, 80, 50, 30, 0];
      const colors = ['#006400', '#389638', '#FFBF00', '#FF8C00', '#B22222'];

      const labels = grades.map((grade, i) => {
        return `<i style="background:${colors[i]}; width: 18px; height: 18px; display: inline-block; margin-right: 8px;"></i> ${
          grade
        }% ${i < grades.length - 4 ? '+' : `&ndash; ${grades[i - 1]}%`}`;
      });

      legendContainer.innerHTML += labels.join('<br>');
      return legendContainer;
    };

    // After map is created
    const legend = addLegend(t, isWideScreen);
    mapRef.current.appendChild(legend);

    // Cleanup in return
    return () => {
      map.setTarget(null);
      if (legend && legend.parentNode) {
        legend.parentNode.removeChild(legend);
      }
    };
  }, [t, isWideScreen, filteredApiResults, originalPoints]);

  return (
    <>
      <GcdsHeading tag="h3" characterLimit="false">
        {t('components.map.header')}
      </GcdsHeading>
      {filteredApiResults.length > 0 || originalPoints.length > 0 ? (
        <>
          <div
            ref={mapRef}
            style={{
              width: '100%',
              height: isWideScreen ? '500px' : '250px',
              position: 'relative',
            }}
            role="region"
            aria-label={t('components.map.aria')}
            tabIndex="0"
          ></div>

          <div
            ref={overlayRef}
            style={{
              position: 'relative',
              backgroundColor: 'white',
              border: '1px solid black',
              borderRadius: '3px',
              padding: '2px',
              pointerEvents: 'none',
              fontSize: isWideScreen ? '12px' : '8px',
              width: '200px',
              display: 'none',
            }}
          ></div>
          <GcdsText size="small" characterLimit="false">
            <i>{t('components.map.warning')}</i>
          </GcdsText>
          <GcdsSrOnly>
            {t('components.reverseBulk.map.screenReader')}
          </GcdsSrOnly>
        </>
      ) : null}
    </>
  );
}
