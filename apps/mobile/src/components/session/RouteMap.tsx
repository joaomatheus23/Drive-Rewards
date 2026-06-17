/**
 * RouteMap
 * Role: mobile
 * Entry: active and summary session screens
 * Exit: dark map with route polyline and current position
 */
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline, type Region } from "react-native-maps";
import type { IGpsPoint } from "@driven-rewards/shared";
import {
  DARK_MAP_STYLE,
  ROUTE_POLYLINE_COLOR,
  ROUTE_POLYLINE_WIDTH,
} from "../../constants/mapStyle";
import { PulsingDot } from "./PulsingDot";

export interface RouteMapProps {
  points: IGpsPoint[];
  interactive?: boolean;
  showPulse?: boolean;
}

function toCoordinates(points: IGpsPoint[]) {
  return points.map((point) => ({
    latitude: point.lat,
    longitude: point.lng,
  }));
}

function buildRegion(points: IGpsPoint[]): Region {
  if (points.length === 0) {
    return {
      latitude: 43.6532,
      longitude: -79.3832,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    };
  }

  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(0.02, (maxLat - minLat) * 1.6),
    longitudeDelta: Math.max(0.02, (maxLng - minLng) * 1.6),
  };
}

export function RouteMap({ points, interactive = true, showPulse = true }: RouteMapProps) {
  const coordinates = useMemo(() => toCoordinates(points), [points]);
  const region = useMemo(() => buildRegion(points), [points]);
  const lastPoint = points[points.length - 1];

  return (
    <View style={styles.wrap}>
      <MapView
        style={styles.map}
        customMapStyle={DARK_MAP_STYLE}
        initialRegion={region}
        region={region}
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        rotateEnabled={interactive}
        pitchEnabled={interactive}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {coordinates.length > 1 ? (
          <Polyline
            coordinates={coordinates}
            strokeColor={ROUTE_POLYLINE_COLOR}
            strokeWidth={ROUTE_POLYLINE_WIDTH}
          />
        ) : null}
        {lastPoint && showPulse ? (
          <Marker coordinate={{ latitude: lastPoint.lat, longitude: lastPoint.lng }}>
            <PulsingDot />
          </Marker>
        ) : null}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
