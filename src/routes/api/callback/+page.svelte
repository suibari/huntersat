<script lang="ts">
  import Spinner from '$lib/components/Spinner.svelte';
  import { oauthManager } from '$lib/oauth';
  import { onMount } from 'svelte';

  onMount(async () => {
    await oauthManager.handleCallback();
    window.location.href = '/'; // 認証後にTOPへリダイレクト
  });
</script>

<Spinner text="Login processing..." />
