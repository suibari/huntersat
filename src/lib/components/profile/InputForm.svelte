<script lang="ts">
  import { platforms, platformsName, weapons, weaponsName } from "$lib/consts";
  import { createEventDispatcher } from "svelte";

  export let hunterName = "";
  export let hunterRank = "-";
  export let selectedPlatforms: string[] = [];
  export let selectedWeapons: Record<string, number> = {};
  export let playTimeRange = [8, 22];
  export let comment = "";
  export let headerImage: string | null = null;

  const dispatch = createEventDispatcher();

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
      hunterRank,
      selectedPlatforms,
      selectedWeapons,
      playTimeRange,
      comment,
      headerImage
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
</script>

<div class="mt-4 p-4 bg-gray-100 rounded-lg w-96">
  <p class="font-semibold">ハンターネーム:</p>
  <input bind:value={hunterName} on:input={update} class="border w-full p-1" />

  <p class="font-semibold mt-2">ハンターランク:</p>
  <input type="number" bind:value={hunterRank} on:input={update} class="border w-full p-1" />

  <p class="font-semibold mt-2">ヘッダー画像:</p>
  <input type="file" accept="image/*" on:change={handleFile} class="border-1" />

  <p class="font-semibold mt-2">プラットフォーム:</p>
  {#each platforms as platform}
    <label class="flex items-center">
      <input type="checkbox" on:change={() => togglePlatform(platform)} />
      {platformsName[platform]}
    </label>
  {/each}

  <p class="font-semibold mt-2">得意武器:</p>
  <div class="grid grid-rows-2">
    {#each weapons as weapon}
      <div class="flex items-center">
        {weaponsName[weapon]}
        <input type="radio" name={weapon} on:change={() => toggleWeapon(weapon, 1)} /> 得意
        <input type="radio" name={weapon} on:change={() => toggleWeapon(weapon, 2)} /> 超得意
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
  <textarea bind:value={comment} on:input={update} class="border w-full p-1 mb-2"></textarea>
</div>
