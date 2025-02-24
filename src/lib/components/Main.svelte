<script lang="ts">
  import InputForm from "./profile/InputForm.svelte";
  import Canvas from "./profile/Canvas.svelte";
  import { myDid, profileData } from "$lib/stores";
  import { handleWebShare } from "$lib/webshare";
  import { oauthManager } from "$lib/oauth";
  import Spinner from "./Spinner.svelte";
  import Post from "./modal/Post.svelte";
  import type { BlobRef } from "@atproto/api";

  let exportImage: (() => Promise<Blob | undefined>);
  let isSaving = false;
  let imageBlob: Blob|undefined;
  let blobRef: BlobRef;
  let postModal = false;

  async function handleSaveAndPost() {
    let record: App.Record;

    isSaving = true;

    const agent = oauthManager.currentAgent;

    try {
      // headerImageはdataURLなので除外する必要がある
      const { headerImage, ...rest } = $profileData;
      record = {
        ...rest,
        createdAt: new Date().toISOString(),
      }

      if ($profileData.headerImage) {
        // headerImage(dataURL)をBlobに変換し, uploadBlob
        const blob = await (await fetch($profileData.headerImage)).blob();
        const response = await agent?.com.atproto.repo.uploadBlob(blob);
        const blobRef = response?.data?.blob;

        record.headerImage = blobRef;
      }

      // purRecord
      await agent?.com.atproto.repo.putRecord({
        collection: "blue.huntersat.profile",
        repo: $myDid!,
        record,
        rkey: "self",
      });
      console.log(`[INFO] successful putRecord`);

      // CanvasをuploadBlob
      imageBlob = await exportImage();
      if (imageBlob) {
        const response = await agent?.com.atproto.repo.uploadBlob(imageBlob);
        if (response?.success && response.data.blob) {
          blobRef = response?.data.blob;
        }
      }

      postModal = true;
    } catch (error) {
      console.error(`[ERROR] uploadBlob/putRecord/post error: ${error}`);
    } finally {
      isSaving = false;
    }
  }

  async function handleSaveAndShare() {
    isSaving = true;

    // ローカルストレージに保存
    localStorage.setItem('profileData', JSON.stringify($profileData));

    // バイナリ変換
    imageBlob = await exportImage();
    postModal = true;

    isSaving = false;
  }
</script>

<div class="flex flex-col xl:flex-row items-center justify-center">
  <InputForm />
  <Canvas
    bind:exportImage={exportImage}
  />
</div>
<div class="flex items-center justify-center">
  {#if $myDid}
    <button class="mt-4 p-2 bg-blue-500 text-white rounded" on:click={handleSaveAndPost}>Save & Post!</button>
  {:else}
    <button class="mt-4 p-2 bg-blue-500 text-white rounded" on:click={handleSaveAndShare}>Save & Share!</button>
  {/if}
</div>

{#if postModal && imageBlob}
  <Post bind:postModal={postModal} {imageBlob} {blobRef} />    
{/if}

{#if isSaving}
  <Spinner text="Saving Data..." />
{/if}
