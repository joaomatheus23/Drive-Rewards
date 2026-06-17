/**
 * Dark Google Maps style
 * Role: mobile
 * Entry: RouteMap during active and summary sessions
 * Exit: customMapStyle prop for react-native-maps
 */
export const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0D0D1A" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b7280" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0D0D1A" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "rgba(255,255,255,0.09)" }] },
  { featureType: "road.local", elementType: "geometry", stylers: [{ color: "rgba(255,255,255,0.05)" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0A1628" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#0B1E16" }] },
] ;

export const ROUTE_POLYLINE_COLOR = "#7C3AED";
export const ROUTE_POLYLINE_WIDTH = 4;
export const CURRENT_POSITION_COLOR = "#A855F7";
