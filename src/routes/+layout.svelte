<script lang="ts">
  import '../app.css';
  import { onMount, setContext } from "svelte";
  import { oauthManager } from "$lib/oauth";
  import Spinner from '$lib/components/Spinner.svelte';
  import { myDid, isLoading } from '$lib/stores';
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
  import Login from '$lib/components/modal/Login.svelte';
  
  let loginModal = $state(false);
  let aboutModal = $state(false);
  let isLoggingOut = $state(false);
  
  setContext("did", myDid);
  setContext("isLoading", isLoading);
  
  let { children } = $props();
  
  onMount(async () => {
    isLoading.set(true);
    
    const provider = localStorage.getItem("provider");
    
    // OAuthセッション初期化または更新
    await oauthManager.init(provider || undefined);
    if (oauthManager.currentSession) {
      myDid.set(oauthManager.currentSession.sub);
    }
    
    isLoading.set(false);
  });
  
  const handleLogout = async () => {
    isLoggingOut = true;
    
    await oauthManager.logout($myDid!);
    
    // UIを未ログイン状態に
    myDid.set(null);
    
    isLoggingOut = false;
  }
</script>

<Navbar>
  <NavBrand href="/">
    <span class="text-xl font-semibold">HuntersAt</span>
  </NavBrand>
  <NavHamburger />
  <NavUl>
    <NavLi class="cursor-pointer" on:click={() => loginModal = true}>Log-in</NavLi>
    <NavLi class="cursor-pointer" on:click={() => aboutModal = true}>About</NavLi>
  </NavUl>
</Navbar>

<div class="p-2">
  {@render children()}
</div>

<Login bind:loginModal={loginModal} />

{#if isLoggingOut}
  <Spinner text="Logging-out..."/>
{/if}
