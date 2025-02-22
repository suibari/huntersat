<script lang="ts">
  import { oauthManager } from '$lib/oauth';
  import { Modal } from 'flowbite-svelte';

  export let loginModal = false;

  let provider = 'https://bsky.social';
  let handle = '';

  async function handleLogin() {
    if (provider && handle) {
      await oauthManager.login(provider, handle);
    }
  }
</script>

<Modal title="Login" bind:open={loginModal} autoclose outsideclose>
  <h1 class="font-bold mb-2">Hosting Provider</h1>
  <input 
    type="text" 
    bind:value={provider} 
    placeholder="Hosting Provider" 
    class="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <h1 class="font-bold mb-2">User Handle</h1>
  <input 
    type="text" 
    bind:value={handle} 
    placeholder="User Handle" 
    class="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    onkeydown={(e) => e.key === 'Enter' && handleLogin()}
  />
  <button 
    onclick={handleLogin} 
    class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
    Login
  </button>
</Modal>
