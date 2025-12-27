import { MAP_CONFIG, COLORS } from './constants'

export const defaultMapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    styles: [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        }
    ]
}

export const getCircleMarker = ({ color = COLORS.SUCCESS, scale = 8, strokeColor = '#fff', strokeWeight = 2 } = {}) => {
    return {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale,
        fillColor: color,
        fillOpacity: 1,
        strokeColor,
        strokeWeight
    }
}
