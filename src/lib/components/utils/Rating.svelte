<script lang="ts">
  export let total: number = 5;         // 星の総数
  export let rating: number = 0;        // 現在のレーティング (少数OK)
  export let size: number = 24;         // 星のサイズ (px)
  export let gap: number = 4;           // 星の間隔 (px)
  export let color: string = "gold";    // 塗りつぶしの色
  export let border: string = "gray";   // 枠線の色
  export let borderWidth: number = 2;   // 枠線の太さ
</script>

<div class="flex" style="gap: {gap}px;">
  {#each Array(total).fill(0) as _, i}
    <div class="relative" style="width: {size}px; height: {size}px;">
      <!-- 背景の星（枠のみ） -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        stroke={border}
        stroke-width="{borderWidth}"
        class="absolute top-0 left-0"
        style="width: {size}px; height: {size}px;"
      >
        <path d="M12 2l2.9 6.8L22 9.8l-5 5 .8 7.2L12 18l-5.8 3 1-7-5-5 6-1z" />
      </svg>

      <!-- 塗りつぶしの星 -->
      {#if i + 1 <= Math.floor(rating)}
        <!-- 完全に塗りつぶす星 -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={color}
          stroke={border}
          stroke-width="{borderWidth}"
          class="absolute top-0 left-0"
          style="width: {size}px; height: {size}px;"
        >
          <path d="M12 2l2.9 6.8L22 9.8l-5 5 .8 7.2L12 18l-5.8 3 1-7-5-5 6-1z" />
        </svg>
      {:else if i < rating}
        <!-- 部分的に塗る星 -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={color}
          stroke={border}
          stroke-width="{borderWidth}"
          class="absolute top-0 left-0"
          style="width: {size}px; height: {size}px; clip-path: inset(0 {100 - (rating - i) * 100}% 0 0);"
        >
          <path d="M12 2l2.9 6.8L22 9.8l-5 5 .8 7.2L12 18l-5.8 3 1-7-5-5 6-1z" />
        </svg>
      {/if}
    </div>
  {/each}
</div>
