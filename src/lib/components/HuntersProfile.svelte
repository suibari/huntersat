<script lang="ts">
  import ProfileHeader from "./header/ProfileHeader.svelte";
  import Rating from "./utils/Rating.svelte";
  import TimeRangeSlider from "./utils/TimeRangeSlider.svelte";

  // 今日の日付を取得（YYYY/MM/DD 形式）
  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  let hunterName = "";
  let hunterID = "";
  let hunterRank = "-";
  let comment = "";
  let backgroundColor = "#ffffff";
  
  const weapons = [
    "gs", "ls", "sns", "db", "hammer", "hh", "lance", "gl", "sa", "cb", "ig", "lbg", "hbg", "bow"
  ];
  let selectedWeapons: Record<string, number> = {};
  
  const platforms = ["ps", "xbox", "steam"];
  let selectedPlatforms: string[] = [];
  
  let playTimeRange = [8, 22];

  function toggleWeapon(weapon: string) {
    if (weapon in selectedWeapons) {
      let newValue = selectedWeapons[weapon] - 1;
      if (newValue <= 0) {
        const { [weapon]: _, ...rest } = selectedWeapons;
        selectedWeapons = rest;
      } else {
        selectedWeapons = { ...selectedWeapons, [weapon]: newValue };
      }
    } else {
      selectedWeapons = { ...selectedWeapons, [weapon]: 3 };
    }
  }

  function togglePlatform(platform: string) {
    if (selectedPlatforms.includes(platform)) {
      selectedPlatforms = selectedPlatforms.filter(p => p !== platform);
    } else {
      selectedPlatforms = [...selectedPlatforms, platform];
    }
  }
</script>

<div class="flex flex-col items-center w-full">
  <div id="profcard" class="p-4 rounded-2xl shadow-lg max-w-[400px]" style="background-color: {backgroundColor};">
    <p class="text-2xl font-semibold mb-2">Hunter's Profile</p>
    <ProfileHeader {hunterName} {hunterID} />

    <div class="flex">
      <div class="flex-1 m-2">
        <!-- HR -->
        <p class="mt-2">HR:</p>
        <div class="p-2 bg-white rounded-md shadow-sm">
          <input bind:value={hunterRank} class="text-md text-gray-600 w-full border-none focus:outline-none" />
        </div>

        <!-- PF -->
        <p class="mt-2">プラットフォーム:</p>
        <div class="p-2 bg-white rounded-md shadow-sm grid grid-cols-3 gap-1">
          {#each platforms as platform}
            <div class="p-1 w-8 h-8 border rounded-md cursor-pointer"
              on:click={() => togglePlatform(platform)}
              class:border-amber-500={selectedPlatforms.includes(platform)}
              class:border-4={selectedPlatforms.includes(platform)}
            >
              <img src="/platforms/{platform}.png" alt={platform} class="w-14" />
            </div>
          {/each}
        </div>
      </div>

      <!-- Weapon -->
      <div class="flex-2 m-2">
        <p class="mt-2">得意武器:</p>
        <div class="p-2 bg-white rounded-md shadow-sm grid grid-cols-5 gap-1">
          {#each weapons as weapon}
            <div class="relative w-8 h-8 border rounded-md flex items-center justify-center cursor-pointer"
              on:click={() => toggleWeapon(weapon)}
              class:border-amber-500={selectedWeapons[weapon] !== undefined}
              class:border-4={selectedWeapons[weapon] !== undefined}
            >
              <img src="/weapons/{weapon}.png" alt={weapon} />
              {#if selectedWeapons[weapon] !== undefined}
                <div class="absolute -bottom-2 w-full flex justify-center rounded-b-md">
                  <Rating
                      total={3}
                      rating={selectedWeapons[weapon]}
                      size={12}
                      gap={0}
                      borderWidth={2}
                  />
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>


    <p class="mt-2">プレイ時間帯:</p>
    <div class="flex flex-col items-center">
      <TimeRangeSlider bind:start={playTimeRange[0]} bind:end={playTimeRange[1]} />
    </div>

    <p class="mt-4">コメント:</p>
    <div class="p-1 bg-white rounded-md shadow-sm">
      <textarea bind:value={comment} class="w-full p-2 border-none focus:outline-none"></textarea>
    </div>

    <div class="w-full flex justify-between items-center mt-2">
      <p>HuntersAt</p>
      <p>作成日: {today}</p>
    </div>
  </div>

  <div class="mt-4 w-full max-w-[400px]">
    <p>背景色:</p>
    <input type="color" bind:value={backgroundColor} class="w-full p-2 border rounded-md" />
  </div>
</div>
