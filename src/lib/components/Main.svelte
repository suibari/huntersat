<script lang="ts">
  import InputForm from "./profile/InputForm.svelte";
  import Canvas from "./profile/Canvas.svelte";
  import { myDid, profileData } from "$lib/stores";
  import { handleWebShare } from "$lib/webshare";
  import { oauthManager } from "$lib/oauth";

  let exportImage: (() => Promise<Blob | undefined>);

  function handleProfileUpdate(event: CustomEvent<App.ProfileData>) {
    profileData.set({ ...event.detail });
  }

  async function handleSaveAndPost() {
    // バイナリ変換
    const blob = await exportImage();

    // User Repoに保存
    const agent = oauthManager.currentAgent;
    const record: App.Record = {
      ...$profileData,
      createdAt: new Date().toISOString(),
    }
    const response = await agent?.com.atproto.repo.putRecord({
      collection: "blue.huntersat.profile",
      repo: $myDid!,
      record,
      rkey: "self",
    });
    console.log(`[INFO] successful putRecord`);
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
    <button class="mt-4 p-2 bg-blue-500 text-white rounded" on:click={handleSaveAndPost}>Save & Post!</button>
  {:else}
    <button class="mt-4 p-2 bg-blue-500 text-white rounded" on:click={handleSaveAndShare}>Save & Share!</button>
  {/if}
</div>
