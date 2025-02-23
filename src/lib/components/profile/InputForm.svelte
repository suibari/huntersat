<script lang="ts">
  import { platforms, platformsName, weapons, weaponsName } from "$lib/consts";
    import { AppBskyActorDefs } from "@atproto/api";
  import { createEventDispatcher, onMount } from "svelte";

  export let hunterName = "";
  export let hunterID = "";
  export let hunterRank = "-";
  export let selectedPlatforms: string[] = [];
  export let selectedWeapons: Record<string, number> = {};
  export let playTimeRange = [8, 22];
  export let comment = "";
  export let headerImage: string | null = null;
  export let backgroundColor: string = "";

  const dispatch = createEventDispatcher();

  onMount(() => {
    backgroundColor = getRandomColor();
    update();
  })

  function toggleWeapon(weapon: string, level: number) {
    selectedWeapons = { ...selectedWeapons, [weapon]: selectedWeapons[weapon] === level ? 0 : level };
    update();
  }

  function togglePlatform(platform: string) {
    if (selectedPlatforms.includes(platform)) {
      selectedPlatforms = selectedPlatforms.filter((p) => p !== platform);
    } else {
      selectedPlatforms = [...selectedPlatforms, platform];
    }
    update();
  }

  function update() {
    dispatch("updateProfile", {
      hunterName,
      hunterID,
      hunterRank,
      selectedPlatforms,
      selectedWeapons,
      playTimeRange,
      comment,
      headerImage,
      backgroundColor,
    });
  }

  function handleFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => cropImage(img);
    };
    reader.readAsDataURL(file);
  }

  function cropImage(img: HTMLImageElement) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 900;
    canvas.height = 400;

    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;

    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    headerImage = canvas.toDataURL("image/png");
    update();
  }

  function getRandomColor() {
    // ランダムなパステルカラーを生成
    const r = Math.floor(Math.random() * 128 + 128);
    const g = Math.floor(Math.random() * 128 + 128);
    const b = Math.floor(Math.random() * 128 + 128);
    return `rgb(${r}, ${g}, ${b})`;
  }
</script>

<div class="m-2 p-4 bg-gray-100 rounded-lg w-auto">
  <p class="font-semibold">ハンターネーム:</p>
  <input bind:value={hunterName} on:input={update} class="border w-full p-1 bg-white" />

  <p class="font-semibold mt-2">ハンターID:</p>
  <input bind:value={hunterID} on:input={update} class="border w-full p-1 bg-white" />

  <p class="font-semibold mt-2">ハンターランク:</p>
  <input type="number" bind:value={hunterRank} on:input={update} class="border w-full p-1" />

  <p class="font-semibold mt-2">ヘッダー画像:</p>
  <input type="file" accept="image/*" on:change={handleFile} class="border-1" />

  <p class="font-semibold mt-2">プラットフォーム:</p>
  {#each platforms as platform}
    <label class="flex items-center gap-1">
      <input type="checkbox" on:change={() => togglePlatform(platform)} />
      {platformsName[platform]}
    </label>
  {/each}

  <p class="font-semibold mt-2">得意武器:</p>
  <div>
    {#each weapons as weapon}
      <div class="flex items-center gap-1">
        <span class="w-32">{weaponsName[weapon]}</span>
        <input type="radio" name={weapon} on:change={() => toggleWeapon(weapon, 0)} /> なし
        <input type="radio" name={weapon} on:change={() => toggleWeapon(weapon, 1)} /> 得意
        <input type="radio" name={weapon} on:change={() => toggleWeapon(weapon, 2)} /> お気に入り
      </div>
    {/each}
  </div>

  <p class="font-semibold mt-2">プレイ時間帯:</p>
  <div class="flex">
    <select bind:value={playTimeRange[0]} on:change={update}>
      {#each Array(24) as _, i}
        <option value={i}>{i}:00</option>
      {/each}
    </select>
    <span>～</span>
    <select bind:value={playTimeRange[1]} on:change={update}>
      {#each Array(24) as _, i}
        <option value={i}>{i}:00</option>
      {/each}
    </select>
  </div>

  <p class="font-semibold mt-2">コメント:</p>
  <textarea bind:value={comment} on:input={update} class="h-[100px] border w-full p-1"></textarea>
  
  <p class="font-semibold mt-2">背景色:</p>
  <input type="color" bind:value={backgroundColor} on:input={update} class="border w-full p-1" />
</div>
