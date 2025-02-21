<script lang="ts">
  import Main from '$lib/components/Main.svelte';
  import LoginForm from '$lib/components/LoginForm.svelte';
  import { myDid, isLoading } from '$lib/stores';
</script>

{#if $myDid}
  <Main />
{:else}
  <LoginForm />
{/if}

