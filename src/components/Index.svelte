<script>
	import StreetScroller from "./StreetScroller.svelte";
	import { getContext } from "svelte";

	let copy = getContext("copy");
</script>


<svelte:boundary onerror={(e) => console.error(e)}>

{#each copy.body || [] as { type, value: props, component }, idx (idx)}
	{#if type === "intro"}
		<StreetScroller {props}/>
	{/if}
	<!-- {@const Component = components[component]} -->
	<!-- <Component {...props} /> -->
{/each}


	<!-- <div class="intro" style="height:1200px;">
	</div>
	<StreetScroller />
	<div class="intro" style="height:1200px;">
	</div>
	<StreetScroller /> -->

</svelte:boundary>

<style>
	.intro {
		background-color: red;
	}

</style>