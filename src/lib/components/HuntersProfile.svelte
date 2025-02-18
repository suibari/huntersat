<script lang="ts">
  let hunterName = '';
  let hunterID = '';
  let favoriteMonster = '';
  let comment = '';
  let playtime = '';
  let backgroundColor = '#ffffff';
  
  const weapons = [
    '大剣', '太刀', '片手剣', '双剣', 'ハンマー', '狩猟笛', 'ランス', 'ガンランス', 'スラッシュアックス', 'チャージアックス', '操虫棍', 'ライトボウガン', 'ヘビィボウガン', '弓'
  ];
  let selectedWeapons: Record<string, "none" | "得意" | "超得意"> = {};
  weapons.forEach(weapon => selectedWeapons[weapon] = "none");
  
  const platforms = ['PS5', 'Xbox', 'Steam'];
  let selectedPlatforms: string[] = [];
  
  let playTimeRange = [8, 22];

  function toggleWeapon(weapon: string, level: "得意" | "超得意") {
    selectedWeapons[weapon] = selectedWeapons[weapon] === level ? "none" : level;
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
    <div class="grid grid-cols-4 gap-2">
      {#each weapons as weapon}
        <div class="flex flex-col items-center">
          <button 
            class="w-16 h-16 border rounded-md flex items-center justify-center"
            class:bg-blue-500={selectedWeapons[weapon] === "得意"}
            class:bg-red-500={selectedWeapons[weapon] === "超得意"}
            class:bg-gray-300={selectedWeapons[weapon] === "none"}
            on:click={() => toggleWeapon(weapon, "得意")}
          >
            {weapon}
          </button>
          <button 
            class="text-xs mt-1 px-2 py-1 border rounded-md"
            class:bg-red-500={selectedWeapons[weapon] === "超得意"}
            class:bg-gray-300={selectedWeapons[weapon] !== "超得意"}
            on:click={() => toggleWeapon(weapon, "超得意")}
          >
            超得意
          </button>
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
  <div class="w-full lg:w-2/3 p-6 rounded-2xl shadow-lg" style="background-color: {backgroundColor};">
    <h1 class="text-3xl font-bold text-center mb-4">ハンタープロフィール</h1>
    <p class="text-xl font-bold">{hunterName}</p>
    <p class="text-md text-gray-600">ID: {hunterID}</p>
    <p class="mt-2">得意武器:</p>
    <div class="grid grid-cols-4 gap-2 mt-2">
      {#each weapons as weapon}
        <div class="w-16 h-16 border rounded-md flex items-center justify-center"
          class:bg-gray-300={selectedWeapons[weapon] === "none"}
          class:bg-blue-500={selectedWeapons[weapon] === "得意"}
          class:bg-red-500={selectedWeapons[weapon] === "超得意"}>
          {weapon}
        </div>
      {/each}
    </div>
    <p>シリーズプレイ時間: {playtime}</p>
    <p class="mt-2">プラットフォーム:</p>
    <div class="grid grid-cols-4 gap-2 mt-2">
      {#each platforms as platform}
        <div class="w-16 h-16 border rounded-md flex items-center justify-center"
          class:bg-gray-300={!selectedPlatforms.includes(platform) || selectedPlatforms.length === 0}
          class:bg-blue-500={selectedPlatforms.includes(platform)}
        >
          {platform}
        </div>
      {/each}
    </div>
    <p>プレイ時間帯: {playTimeRange[0]}時 〜 {playTimeRange[1]}時</p>
    <p>好きなモンスター: {favoriteMonster}</p>
    <p class="mt-4">{comment}</p>
  </div>
</div>
