import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Check } from 'lucide-react';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom green marker icon
const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function MapView({ farmers = [] }) {
    // La Trinidad, Benguet coordinates
    const center = [16.4565, 120.5963];
    const zoom = 13;

    return (
        <MapContainer 
            center={center} 
            zoom={zoom} 
            style={{ height: '100%', width: '100%' }}
            className="z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {Array.isArray(farmers) && farmers.map((farmer) => {
                const lat = farmer.latitude || farmer.lat || 16.4565;
                const lng = farmer.longitude || farmer.lng || 120.5963;
                const farmerCrops = Array.isArray(farmer.crops) ? farmer.crops : [];
                
                return (
                    <Marker 
                        key={farmer.id} 
                        position={[lat, lng]}
                        icon={greenIcon}
                    >
                        <Popup>
                            <div className="p-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium text-sm">
                                        {farmer.name || farmer.user?.name || 'Farmer'}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {farmerCrops.map((crop, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-green-600 rounded-full p-1"
                                            title={typeof crop === 'object' ? crop.name : crop}
                                        >
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
