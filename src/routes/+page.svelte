<script lang="ts">
  import HuntersProfile from '$lib/components/HuntersProfile.svelte';
import LoginForm from '$lib/components/LoginForm.svelte';
import { myDid, isLoading } from '$lib/stores';
</script>

{#if $myDid}
  <HuntersProfile />
{:else}
  <LoginForm />
{/if}

