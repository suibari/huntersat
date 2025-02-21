<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let hunterName = "";
  export let hunterRank = "-";
  export let selectedPlatforms: string[] = [];
  export let selectedWeapons: Record<string, number> = {};
  export let playTimeRange = [8, 22];
  export let comment = "";
  export let headerImage: string | null = null;

  const weapons = ["gs", "ls", "sns", "db", "hammer", "hh", "lance", "gl", "sa", "cb", "ig", "lbg", "hbg", "bow"];
  const platforms = ["PS5", "Xbox", "Steam"];

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
  <label>ヘッダー画像:</label>
  <input type="file" accept="image/*" on:change={handleFile} class="mb-2" />
  {#if headerImage}
    <img src={headerImage} alt="ヘッダー画像" class="w-full h-auto rounded-lg mb-2" />
  {/if}

  <label>ハンターネーム:</label>
  <input bind:value={hunterName} on:input={update} class="border w-full p-1 mb-2" />

  <label>HR:</label>
  <input type="number" bind:value={hunterRank} on:input={update} class="border w-full p-1 mb-2" />

  <label>プラットフォーム:</label>
  {#each platforms as platform}
    <label class="flex items-center">
      <input type="checkbox" on:change={() => togglePlatform(platform)} />
      {platform}
    </label>
  {/each}

  <label>得意武器:</label>
  {#each weapons as weapon}
    <div class="flex items-center">
      <input type="radio" name={weapon} on:change={() => toggleWeapon(weapon, 1)} /> 得意
      <input type="radio" name={weapon} on:change={() => toggleWeapon(weapon, 2)} /> 超得意
    </div>
  {/each}

  <label>プレイ時間帯:</label>
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

  <label>コメント:</label>
  <textarea bind:value={comment} on:input={update} class="border w-full p-1 mb-2"></textarea>
</div>
