<script lang="ts">
    import { onMount } from 'svelte';
    import PocketBase from 'pocketbase';
    import { GeoapifyGeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';

    let pottyName: string = '';
    let pottyAddress: string = '';
    let pottyRule: string = '';
    let pottyNotes: string = '';
    let pottyType: string = '';
    let pottyRules: { pottyRule: string }[] = [];
    let pottyTypes: { pottyType: string }[] = [];

    const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

    onMount(async () => {
        pottyRules = await pb.collection('PottyRules').getFullList();
        pottyTypes = await pb.collection('PottyTypes').getFullList();
    });

    const submitForm = async () => {
        const location = await geocodeAddress(pottyAddress);
        await pb.collection('PottyList').create({
            pottyName,
            pottyAddress,
            pottyRule,
            pottyNotes,
            pottyType,
            location
        });
    };

    const geocodeAddress = async (address: string): Promise<number[]> => {
        const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${address}&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`);
        const data = await response.json();
        return data.features[0].geometry.coordinates;
    };

    // Event handler function with type assertion
    function handleSelect(e: CustomEvent) {
        pottyAddress = e.detail.properties.formatted;
    }
</script>

<form on:submit|preventDefault={submitForm}>
    <input type="text" bind:value={pottyName} placeholder="Potty Name" required />
    <GeoapifyGeocoderAutocomplete 
        value={pottyAddress}
        placeholder="Enter address"
        apiKey={import.meta.env.VITE_GEOAPIFY_API_KEY}
        on:select={handleSelect} 
    />
    <select bind:value={pottyRule} required>
        {#each pottyRules as rule}
            <option value={rule.pottyRule}>{rule.pottyRule}</option>
        {/each}
    </select>
    <textarea bind:value={pottyNotes} placeholder="Potty Notes"></textarea>
    <select bind:value={pottyType} required>
        {#each pottyTypes as type}
            <option value={type.pottyType}>{type.pottyType}</option>
        {/each}
    </select>
    <button type="submit">Submit</button>
</form>