<script lang="ts">
  import Rating from "./utils/Rating.svelte";
    import TimeRangeSlider from "./utils/TimeRangeSlider.svelte";

  let hunterName = '';
  let hunterID = '';
  let favoriteMonster = '';
  let comment = '';
  let playtime = '';
  let backgroundColor = '#ffffff';
  
  const weapons = [
    'gs', 'ls', 'sns', 'db', 'hammer', 'hh', 'lance', 'gl', 'sa', 'cb', 'ig', 'lbg', 'hbg', 'bow'
  ];
  let selectedWeapons: Record<string, number> = {};
  
  const platforms = ['ps', 'xbox', 'steam'];
  let selectedPlatforms: string[] = [];
  
  let playTimeRange = [8, 22];

  function toggleWeapon(weapon: string) {
    if (weapon in selectedWeapons) {
      // 削除（選択解除）
      const { [weapon]: _, ...rest } = selectedWeapons;
      selectedWeapons = rest;
    } else {
      // 追加（デフォルト値3）
      selectedWeapons = { ...selectedWeapons, [weapon]: 3 };
    }
  }
</script>

<div class="flex flex-col lg:flex-row items-start gap-8 p-4">
  <!-- 入力フォーム -->
  <div class="w-full lg:w-1/3 p-6 rounded-2xl shadow-lg bg-white">
    <h1 class="text-2xl font-bold mb-4">プロフィール入力</h1>
    <label class="block mb-2">ハンターネーム</label>
    <input bind:value={hunterName} class="w-full p-2 border rounded-md mb-4" />
    
    <label class="block mb-2">ハンターID</label>
    <input bind:value={hunterID} class="w-full p-2 border rounded-md mb-4" />
    
    <label class="block mb-2">得意武器</label>
    <div class="grid grid-cols-2 gap-2">
      {#each weapons as weapon}
        <div class="flex gap-2 items-center">
          <!-- 武器の選択ボタン -->
          <input type="checkbox" on:click={() => {toggleWeapon(weapon)}} />
            {weapon}
    
          <!-- 選択時のみスライダー表示 -->
          {#if weapon in selectedWeapons}
            <input 
              type="range" 
              min="0" max="3" step="0.5" 
              bind:value={selectedWeapons[weapon]}
              class="mt-2 w-16"
            />
            <p class="text-xs">得意度: {selectedWeapons[weapon]}</p>
          {/if}
        </div>
      {/each}
    </div>
    
    <label class="block mb-2">シリーズプレイ時間</label>
    <input bind:value={playtime} placeholder="例: 500時間" class="w-full p-2 border rounded-md mb-4" />
    
    <label class="block mb-2">プラットフォーム</label>
    {#each platforms as platform}
      <div class="mb-2">
        <input type="checkbox" bind:group={selectedPlatforms} value={platform} /> {platform}
      </div>
    {/each}
    
    <label class="block mb-2">プレイ時間帯</label>
    <input type="range" min="0" max="24" step="1" bind:value={playTimeRange[0]} class="w-full" />
    <input type="range" min="0" max="24" step="1" bind:value={playTimeRange[1]} class="w-full" />
    <p>プレイ時間: {playTimeRange[0]}時 〜 {playTimeRange[1]}時</p>
    
    <label class="block mb-2">好きなモンスター</label>
    <input bind:value={favoriteMonster} class="w-full p-2 border rounded-md mb-4" />
    
    <label class="block mb-2">コメント</label>
    <textarea bind:value={comment} class="w-full p-2 border rounded-md mb-4"></textarea>
    
    <label class="block mb-2">背景色</label>
    <input type="color" bind:value={backgroundColor} class="w-full p-2 border rounded-md" />
  </div>
  
  <!-- プロフィールカード -->
  <div id="profcard" class="w-full lg:w-2/3 p-6 rounded-2xl shadow-lg" style="background-color: {backgroundColor};">
    <h1 class="text-3xl font-bold text-center mb-4">ハンタープロフィール</h1>
    <div class="p-4 bg-white rounded-md shadow-sm">
      <p class="text-xl font-bold">{hunterName}</p>
      <p class="text-md text-gray-600">ID: {hunterID}</p>
    </div>
    <p class="mt-2">得意武器:</p>
    <div class="grid grid-cols-4 gap-2 mt-2">
      {#each weapons as weapon}
        <div class="relative w-16 h-16 border rounded-md flex items-center justify-center"
          class:border-amber-500={selectedWeapons[weapon] !== undefined}
          class:border-4={selectedWeapons[weapon] !== undefined}
        >
          <img src="/weapons/{weapon}.png" alt={weapon} />
          {#if selectedWeapons[weapon] !== undefined}
            <div class="absolute -bottom-2 w-full flex justify-center rounded-b-md">
              <Rating
                  total={3}
                  rating={selectedWeapons[weapon]}
                  size={25}
                  gap={1}
                  borderWidth={2}
                />
            </div>
          {/if}
        </div>
      {/each}
    </div>
    <p>シリーズプレイ時間: {playtime}</p>
    <p class="mt-2">プラットフォーム:</p>
    <div class="grid grid-cols-4 gap-2 mt-2">
      {#each platforms as platform}
        <div class="w-16 h-16 border rounded-md flex items-center justify-center"
          class:border-amber-500={selectedPlatforms.includes(platform)}
          class:border-4={selectedPlatforms.includes(platform)}
        >
          <img src="/platforms/{platform}.png" alt={platform} class="w-14" />
        </div>
      {/each}
    </div>
    <p class="mt-2">プレイ時間帯:</p>
    <div class="flex flex-col items-center mt-2">
      <TimeRangeSlider start={playTimeRange[0]} end={playTimeRange[1]} />
    </div>
    <p class="mt-2">好きなモンスター:</p>
    <div class="p-4 bg-white rounded-md shadow-sm">
      <p>{favoriteMonster}</p>
    </div>
    <p class="mt-4">コメント:</p>
    <div class="p-4 bg-white rounded-md shadow-sm">
      <p>{comment}</p>
    </div>
  </div>
</div>
