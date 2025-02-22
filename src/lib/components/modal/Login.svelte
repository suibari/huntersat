<script lang="ts">
  import { oauthManager } from '$lib/oauth';
  import { Modal } from 'flowbite-svelte';

  export let loginModal = false;

  let provider = '';
  let handle = '';

  async function handleLogin() {
    if (provider && handle) {
      await oauthManager.login(provider, handle);
    }
  }
</script>

<Modal bind:open={loginModal} autoclose outsideclose>
  <h1 class="text-xl font-bold text-center mb-4">Login</h1>
  <input 
    type="text" 
    bind:value={provider} 
    placeholder="Hosting Provider" 
    class="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
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
