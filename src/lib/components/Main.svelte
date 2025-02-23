<script lang="ts">
  import InputForm from "./profile/InputForm.svelte";
  import Canvas from "./profile/Canvas.svelte";
  import { myDid, profileData } from "$lib/stores";
  import { handleWebShare } from "$lib/webshare";

  let exportImage: (() => Promise<Blob | undefined>);

  function handleProfileUpdate(event: CustomEvent<App.ProfileData>) {
    profileData.set({ ...event.detail });
  }

  async function handleSaveAndShare() {
    // ローカルストレージに保存
    localStorage.setItem('profileData', JSON.stringify($profileData));

    // バイナリ変換
    const blob = await exportImage();

    // Web Share API
    if (blob) {
      await handleWebShare(blob);
    }
  }
</script>

<div class="flex flex-col xl:flex-row items-center justify-center">
  <InputForm on:updateProfile={handleProfileUpdate} />
  <Canvas bind:exportImage={exportImage} {...$profileData} />
</div>
<div class="flex items-center justify-center">
  {#if $myDid}
    <button class="mt-4 p-2 bg-blue-500 text-white rounded">Save & Post!</button>
  {:else}
    <button class="mt-4 p-2 bg-blue-500 text-white rounded" on:click={handleSaveAndShare}>Save & Share!</button>
  {/if}
</div>
