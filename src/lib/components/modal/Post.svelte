<script lang="ts">
  import { oauthManager } from "$lib/oauth";
  import { myDid } from "$lib/stores";
  import { blobToDataURL } from "$lib/util";
  import { RichText } from "@atproto/api";
  import { BlobRef } from '@atproto/lexicon'
  import { Modal } from "flowbite-svelte";
  import { onMount } from "svelte";

  export let postModal = false;
  export let imageBlob: Blob;
  export let blobRef: BlobRef;

  let textPost = "ギルドカードを作ったよ。ひと狩り行こうぜ! #MHWs #MHWilds\nhttps://huntersat.suibari.com/";

  let dataURL: string;

  onMount(async () => {
    dataURL = await blobToDataURL(imageBlob);
  })

  async function handlePost() {
    const agent = oauthManager.currentAgent!;

    // post
    if (blobRef) {
      const text = textPost;
      const richText = new RichText({text});
      await richText.detectFacets(agent);
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
  <div class="flex flex-col items-center gap-2">
    <img src={dataURL} alt="Hunters Profile Preview" />
    <textarea class="w-full" bind:value={textPost}></textarea>
    <button 
      onclick={handlePost}
      class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
      Post
    </button>
  </div>
</Modal>
