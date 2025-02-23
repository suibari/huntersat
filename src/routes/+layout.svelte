<script lang="ts">
  import '../app.css';
  import { onMount, setContext } from "svelte";
  import { oauthManager } from "$lib/oauth";
  import Spinner from '$lib/components/Spinner.svelte';
  import { myDid, isLoading, profileData } from '$lib/stores';
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
  import Login from '$lib/components/modal/Login.svelte';
  
  let loginModal = $state(false);
  let isLoggingOut = $state(false);
  
  setContext("did", myDid);
  setContext("isLoading", isLoading);
  
  let { children } = $props();
  
  onMount(async () => {
    let tmpProfileData: App.ProfileData;

    isLoading.set(true);
    
    const provider = localStorage.getItem("provider");
    
    // OAuthセッション初期化または更新
    await oauthManager.init(provider || undefined);
    if (oauthManager.currentSession) {
      myDid.set(oauthManager.currentSession.sub);
    }

    if ($myDid) {
      // ログイン済みなら、User Repoからデータ取得
      const agent = oauthManager.currentAgent!;
      const {data} = await agent.com.atproto.repo.getRecord({
        collection: "blue.huntersat.profile",
        repo: $myDid,
        rkey: 'self',
      });
      tmpProfileData = data.value as App.ProfileData;
    } else {
      // 未ログインなら、ローカルストレージからデータ取得
      const data = localStorage.getItem('profileData');
      if (data) {
        tmpProfileData = JSON.parse(data) as App.ProfileData;
      } else {
        // ローカルストレージにデータもなければ初期値セット
        tmpProfileData = {
          hunterName: "",
          hunterID: "",
          hunterRank: "-",
          selectedPlatforms: [],
          selectedWeapons: {},
          playTimeRange: [8, 22],
          comment: "",
          headerImage: "",
          backgroundColor: "",
        };
      }
    }
    profileData.set(tmpProfileData);
    
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

<Navbar class="bg-base text-accent">
  <NavBrand href="/">
    <span class="text-xl font-semibold">HuntersAt</span>
  </NavBrand>
  <NavHamburger />
  <NavUl class="">
    {#if $myDid}
      <NavLi class="cursor-pointer text-accent" on:click={() => loginModal = true}>Log-out</NavLi>
    {:else}
      <NavLi class="cursor-pointer text-accent" on:click={() => loginModal = true}>Log-in with Bluesky</NavLi>
    {/if}
  </NavUl>
</Navbar>

<div class="p-2">
  {@render children()}
</div>

<Login bind:loginModal={loginModal} />

{#if isLoggingOut}
  <Spinner text="Logging-out..."/>
{/if}
