<script lang="ts">
    import { onMount } from 'svelte';
    import PocketBase from 'pocketbase';
    import { map, tileLayer, marker } from 'leaflet';
    import 'leaflet/dist/leaflet.css';

    type Potty = {
        pottyName: string;
        pottyAddress: string;
        pottyRule: string;
        pottyNotes: string;
        pottyType: string;
        location: {
            latitude: number;
            longitude: number;
        };
    };

    let pottyList: Potty[] = [];
    let userLocation: [number, number] = [0, 0];
    const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

    onMount(async () => {
        const records = await pb.collection('PottyList').getFullList();
        pottyList = records.map(record => ({
            pottyName: record.pottyName as string,
            pottyAddress: record.pottyAddress as string,
            pottyRule: record.pottyRule as string,
            pottyNotes: record.pottyNotes as string,
            pottyType: record.pottyType as string,
            location: {
                latitude: (record.location as { latitude: number, longitude: number }).latitude,
                longitude: (record.location as { latitude: number, longitude: number }).longitude
            }
        }));
        navigator.geolocation.getCurrentPosition((position) => {
            userLocation = [position.coords.latitude, position.coords.longitude];
            initMap();
        });
    });

    const initMap = () => {
        const myMap = map('map').setView(userLocation, 13);
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(myMap);
        
        pottyList.forEach(potty => {
            marker([potty.location.latitude, potty.location.longitude])
                .addTo(myMap)
                .bindPopup(`<b>${potty.pottyName}</b><br>${potty.pottyNotes}`);
        });
    };
</script>

<div id="map" style="height: 100vh;"></div>

<style>
    #map { height: 400px; }
</style>
