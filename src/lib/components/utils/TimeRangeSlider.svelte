<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let start = 8;
  export let end = 22;
  export let min = 0;
  export let max = 24;
  export let trackColor = "#3b82f6"; // 青色
  export let thumbColor = "#ffffff"; // 白色

  const dispatch = createEventDispatcher();

  const handleStartChange = (event: Event) => {
    const newValue = Number((event.target as HTMLInputElement).value);
    if (newValue < end) {
      start = newValue;
      dispatch("change", { start, end });
    }
  };

  const handleEndChange = (event: Event) => {
    const newValue = Number((event.target as HTMLInputElement).value);
    if (newValue > start) {
      end = newValue;
      dispatch("change", { start, end });
    }
  };

  // 選択範囲のグラデーションスタイルを更新
  $: trackStyle = `
    background: linear-gradient(to right, 
      #ddd ${(start - min) / (max - min) * 100}%, 
      ${trackColor} ${(start - min) / (max - min) * 100}%, 
      ${trackColor} ${(end - min) / (max - min) * 100}%, 
      #ddd ${(end - min) / (max - min) * 100}%);
  `;
</script>

<div class="w-full">
  <!-- 目盛り -->
  <div class="relative w-full h-6">
    {#each Array(max - min + 1).fill(0).map((_, i) => i + min) as hour}
      <div class="absolute text-xs" style="left: {((hour - min) / (max - min)) * 100}%;">
        {hour}
      </div>
    {/each}
  </div>

  <!-- スライダー部分 -->
  <div class="relative w-full mt-2">
    <!-- 背景のバー（選択範囲の色付け） -->
    <div class="absolute w-full h-2 rounded-lg" style={trackStyle}></div>

    <!-- スライダー -->
    <input 
      type="range" min={min} max={max} bind:value={start} 
      on:input={handleStartChange} class="slider" style="z-index: 3;" />
    <input 
      type="range" min={min} max={max} bind:value={end} 
      on:input={handleEndChange} class="slider" style="z-index: 3;" />
  </div>
</div>

<style>
  .slider {
    position: absolute;
    width: 100%;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    pointer-events: none;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: var(--thumb-color);
    border: 2px solid #000;
    border-radius: 50%;
    pointer-events: auto;
    position: relative;
    z-index: 3;
  }

  .slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: var(--thumb-color);
    border: 2px solid #000;
    border-radius: 50%;
    pointer-events: auto;
    position: relative;
    z-index: 3;
  }
</style>
