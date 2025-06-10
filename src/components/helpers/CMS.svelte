<script>
	// components: an object of components that map to section names (e.g., { "Hero": Hero }) where Hero is a Svelte component
	// body: an array of objects that contain a {section, content} obj
	let { components = {}, body = [] } = $props();
</script>

{#each body as item}
	{#if 'section' in item}
		{@const id = item.section.toLowerCase().replace(/[^a-z0-9]/g, "")}
		{@const C = components[item.section]}
		<section {id}>
			{#if C}
				<C {...item.content} />
			{:else}
				{#each item.content as { type, value }}
					{@const C = components[type]}
					{@const isString = typeof value === "string"}
					{#if C}
						<C {...value} />
					{:else if type === "text"}
						<p>{@html value}</p>
					{:else if isString}
						<svelte:element this={type}>
							{@html value}
						</svelte:element>
					{:else}
						<svelte:element this={type} {...value}></svelte:element>
					{/if}
				{/each}
			{/if}
		</section>
	{:else if 'type' in item}
		{@const C = components[item.type]}
		{#if C}
			<C {...item.value} />
		{:else if item.type === "text"}
			<p>{@html item.value}</p>
		{:else if typeof item.value === "string"}
			<svelte:element this={item.type}>
				{@html item.value}
			</svelte:element>
		{:else}
			<svelte:element this={item.type} {...item.value}></svelte:element>
		{/if}
	{/if}
{/each}
