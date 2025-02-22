<script lang="ts">
  import { page } from '$app/stores';
  import { weapons } from '$lib/consts';
  import Konva from 'konva';
  import { onMount, tick } from "svelte";
  import { Stage, Layer, Rect, Text, Image, Star, Line } from 'svelte-konva';
  import type { Layer as KonvaLayer } from 'konva/lib/Layer';

  export let hunterName = "";
  export let hunterRank = "-";
  export let selectedPlatforms: string[] = [];
  export let selectedWeapons: Record<string, number> = {};
  export let playTimeRange = [18, 23];
  export let comment = "";
  export let headerImage: string;
  export let backgroundColor: string;

  let background: HTMLImageElement;
  let header: HTMLImageElement;
  let rectRef: any;

  const configLine = [48 + (32 * playTimeRange[0]), 764, 50 + (33.5 * playTimeRange[1]), 764];

  onMount(() => {
    const bg = document.createElement('img');
    bg.src = `${$page.url.origin}/card/cardbg.png`;
    bg.onload = () => {
      background = bg;
    }
  });

  $: {
    if (window && headerImage && backgroundColor) {
      const hd = document.createElement('img');
      hd.src = headerImage;
      hd.onload = () => {
        header = hd;
      }
    }
  }

  // 色を更新する関数
  async function updateColor(color: string) {
    console.log(color)
    await tick(); // Svelteの状態更新後に処理
    if (rectRef?.handle) {
      rectRef.handle.fill(color);
      rectRef.handle.getLayer()?.batchDraw(); // 変更を描画
    }
  }

  // colorが変わったら反映
  $: updateColor(backgroundColor);

  const configRect = (x_base: number, x_offset: number, y_base:number, y_offset: number) => {
    return {
      x: x_base + x_offset,
      y: y_base + y_offset,
      width: 60,
      height: 60,
      stroke: "red",
      strokeWidth: 8,
    }
  }
</script>

<Stage
  width={900}
  height={1200}
>
  <!-- 背景色 -->
  <Layer>
    <Rect 
      bind:this={rectRef}
      width={900}
      height={1200}
      fill={backgroundColor},
    />
  </Layer>

  <!-- ヘッダー -->
  <Layer>
    <Image image={header} />
  </Layer>

  <!-- カードレイアウト -->
  <Layer>
    <Image image={background} />
  </Layer>

  <!-- 文字入れ -->
  <Layer>
    <Text
      x={20}
      y={300}
      text={hunterName}
      fontSize={50}
      fill='white'
    />
    <Text
      x={20}
      y={360}
      text="Hunter-ID: {hunterName}"
      fontSize={25}
      fill='white'
    />
    <Text
      x={170}
      y={460}
      text={hunterRank}
      fontSize={40}
      fill='black'
      align='center'
    />
    <Text
      x={40}
      y={860}
      lineHeight={1.5}
      width={820}
      text={comment}
      fontSize={16}
      fill='black'
    />
  </Layer>

  <Layer>
    <!-- プラットフォームアイコン -->
    {#if selectedPlatforms.includes("ps")}
      <Rect
        {...configRect(55, 0, 578, 0)}
      />
    {/if}
    {#if selectedPlatforms.includes("xbox")}
      <Rect
        {...configRect(55, 88, 578, 0)}
      />
    {/if}
    {#if selectedPlatforms.includes("steam")}
      <Rect
        {...configRect(55, 88 * 2, 578, 0)}
      />
    {/if}

    <!-- 武器アイコン -->
    {#each weapons as weapon, i}
      {#if selectedWeapons[weapon]}
        <Rect
          {...configRect(368, 71 * (i % 7), 486, (i < 7 ? 0 : 78))}
        />
        {#if selectedWeapons[weapon] > 1}
          <Star
            x={380 + 71 * (i % 7)}
            y={495 + (i < 7 ? 0 : 78)}
            innerRadius={6}
            outerRadius={12}
            numPoints={5}
            fill="gold"
            stroke="black"
            strokeWidth={1}
          />
        {/if}
      {/if}
    {/each}

    <!-- プレイ時間 -->
    <Line
      points={configLine}
      stroke="blue"
      strokeWidth={10}
      opacity={0.5}
    />
  </Layer>
</Stage>
