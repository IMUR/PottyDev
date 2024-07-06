<script lang="ts">
    import { onMount } from 'svelte';
    import PocketBase from 'pocketbase';

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
            pottyList = sortPottyListByDistance(pottyList, userLocation);
        });
    });

    const sortPottyListByDistance = (list: Potty[], userLocation: [number, number]): Potty[] => {
        return list.sort((a, b) => {
            const distA = getDistance(userLocation, [a.location.latitude, a.location.longitude]);
            const distB = getDistance(userLocation, [b.location.latitude, b.location.longitude]);
            return distA - distB;
        });
    };

    const getDistance = ([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]): number => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };
</script>

<ul>
    {#each pottyList as potty}
        <li>
            <h3>{potty.pottyName}</h3>
            <p>{potty.pottyAddress}</p>
            <p>{potty.pottyRule}</p>
            <p>{potty.pottyNotes}</p>
            <p>{potty.pottyType}</p>
        </li>
    {/each}
</ul>
