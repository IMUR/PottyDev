<script lang="ts">
    import Form from './components/Form.svelte';
    import Map from './components/Map.svelte';
    import List from './components/List.svelte';
</script>

<main>
    <Form />
    <Map />
    <List />
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
