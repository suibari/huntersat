<script lang="ts">
  import { oauthManager } from "$lib/oauth";
  import { myDid } from "$lib/stores";
  import { uint8ArrayToDataURL } from "$lib/util";
  import { RichText } from "@atproto/api";
  import { BlobRef } from '@atproto/lexicon'
  import { Modal } from "flowbite-svelte";
  import { onMount } from "svelte";

  export let postModal = false;
  export let blobRef: BlobRef;

  let dataURL: string;

  onMount(async () => {
    const agent = oauthManager.currentAgent!;

    const response = await agent.com.atproto.sync.getBlob({
      did: $myDid!,
      cid: blobRef.ref,
    },{
      
    });
    if (response?.success) {
      dataURL = await uint8ArrayToDataURL(response.data);
    }
  })

  async function handlePost() {
    const agent = oauthManager.currentAgent!;

    // post
    if (blobRef) {
      const text = "私のハンターズプロフィールだよ。一狩り行こうぜ! #MHWs\nhttps://huntersat.suibari.com/";
      const richText = new RichText({text});
      await agent.post({
        text: richText.text,
        facets: richText.facets,
        embed: {
          $type: 'app.bsky.embed.images',
          images: [
            {
              alt: `Hunters Profile of ${$myDid}, @HuntersAt`,
              image: blobRef,
              aspectRatio: {
                width: 3,
                height: 4,
              }
            }
          ]
        },
        langs: ["ja-JP"],
        createdAt: new Date().toISOString(),
      });
      console.log(`[INFO] successful post with image`);
    }
  }
</script>

<Modal title="Post" bind:open={postModal} autoclose outsideclose>
  <img src={dataURL} alt="Hunters Profile Preview" />
  <button 
    onclick={handlePost} 
    class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
    Post
  </button>
</Modal>
