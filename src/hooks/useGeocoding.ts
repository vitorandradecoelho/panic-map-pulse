import { useState, useEffect } from 'react';

interface AddressCache {
  [key: string]: string;
}

export const useGeocoding = () => {
  const [addressCache, setAddressCache] = useState<AddressCache>({});

  const getAddress = async (lat: number, lng: number): Promise<string> => {
    const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    
    // Check cache first
    if (addressCache[key]) {
      return addressCache[key];
    }

    try {
      // COMMENTED OUT: Using Nominatim (OpenStreetMap) for reverse geocoding
      // const response = await fetch(
      //   `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=pt-BR`
      // );
      
      // if (!response.ok) {
      //   throw new Error('Geocoding failed');
      // }

      // const data = await response.json();
      
      // let address = 'Endereço não encontrado';
      
      // if (data && data.address) {
      //   const { house_number, road, suburb, city, state } = data.address;
      //   const parts = [
      //     house_number && road ? `${road}, ${house_number}` : road,
      //     suburb,
      //     city,
      //     state
      //   ].filter(Boolean);
      //   
      //   address = parts.length > 0 ? parts.join(', ') : data.display_name;
      // }
      
      // Return coordinates as fallback instead of API call
      const address = `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`;
      
      // Cache the result
      setAddressCache(prev => ({ ...prev, [key]: address }));
      
      return address;
    } catch (error) {
      console.warn('Geocoding error:', error);
      return `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`;
    }
  };

  return { getAddress };
};