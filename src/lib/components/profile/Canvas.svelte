<script lang="ts">
  import { page } from '$app/stores';
  import { weapons } from '$lib/consts';
  import { profileData } from '$lib/stores';
  import { onMount, tick } from "svelte";
  import { Stage, Layer, Rect, Text, Image, Star, Line } from 'svelte-konva';

  let background: HTMLImageElement;
  let header: HTMLImageElement;
  let stageRef: any;
  let rectRef: any;
  let lineRef: any;
  let canvasWidth = 900;
  let canvasHeight = 1200;
  let canvasScale = 1;

  const configLine = [48 + (33.5 * $profileData.playTimeRange[0]), 764, 50 + (33.5 * $profileData.playTimeRange[1]), 764];

  onMount(() => {
    const bg = document.createElement('img');
    bg.src = `${$page.url.origin}/card/cardbg.png`;
    bg.onload = () => {
      background = bg;
    }

    updateScale();
    window.addEventListener("resize", updateScale);

    updateColor($profileData.backgroundColor);
  });

  $: {
    if (window && $profileData.headerImage) {
      const hd = document.createElement('img');
      hd.src = $profileData.headerImage;
      hd.onload = () => {
        header = hd;
      }
    }
  }

  /**
   * 背景色変更
   * @param color
   */
  async function updateColor(color: string) {
    await tick(); // Svelteの状態更新後に処理
    if (rectRef?.handle) {
      rectRef.handle.fill(color);
      rectRef.handle.getLayer()?.batchDraw(); // 変更を描画
    }
  }

  // colorが変わったら反映
  $: updateColor($profileData.backgroundColor);

  /**
   * プレイ時間変更
   * @param playtime
   */
  async function updatePlaytime(playtime: number[]) {
    let configLine = [48 + (33.5 * playtime[0]), 764, 50 + (33.5 * playtime[1]), 764];

    await tick();
    if (lineRef?.handle) {
      lineRef.handle.points(configLine)
      lineRef.handle.getLayer()?.batchDraw(); // 変更を描画
    }
  }

  $: updatePlaytime($profileData.playTimeRange);

  /**
   * Scale変更
   */
  function updateScale() {
    const container = document.getElementById("containter");
    if (container) {
      const parentWidth = Math.min(container.clientWidth, 900); // 最大900px
      canvasScale = parentWidth / 900;
      canvasWidth = parentWidth;
      canvasHeight = 1200 * canvasScale; // 縦も縮小
    }
  }

  /**
   * Canvas画像変換
   */
  export async function exportImage(): Promise<Blob|undefined> {
    if (stageRef) {
      const dataUrl = await stageRef.handle().toBlob({
        mimeType: "image/png",
        pixelRatio: 0.8
      });
      return dataUrl as Blob;
    }
  }

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

  function getDate() {
    const now = new Date();
    return `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}`;
  }
</script>

<div
  id="containter"
  class="w-full md:w-max origin-top-left"
  style="transform: scale({canvasScale}); height: {canvasHeight}px;"
>
  <Stage
    bind:this={stageRef}
    width={900}
    height={1200}
  >
    <!-- 背景色 -->
    <Layer>
      <Rect 
        bind:this={rectRef}
        width={900}
        height={1200}
        fill={$profileData.backgroundColor},
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
        text={$profileData.hunterName}
        fontSize={50}
        fill='white'
      />
      <Text
        x={20}
        y={360}
        text="Hunter-ID: {$profileData.hunterID}"
        fontSize={25}
        fill='white'
      />
      <Text
        x={170}
        y={460}
        text={$profileData.hunterRank}
        fontSize={40}
        fill='black'
        align='center'
      />
      <Text
        x={40}
        y={860}
        lineHeight={1.5}
        width={820}
        text={$profileData.comment}
        fontSize={16}
        fill='black'
      />
      <Text
        x={20}
        y={1150}
        text={getDate()}
        fontSize={40}
        fill='black'
      />
    </Layer>

    <Layer>
      <!-- プラットフォームアイコン -->
      {#if $profileData.selectedPlatforms.includes("ps")}
        <Rect
          {...configRect(55, 0, 578, 0)}
        />
      {/if}
      {#if $profileData.selectedPlatforms.includes("xbox")}
        <Rect
          {...configRect(55, 88, 578, 0)}
        />
      {/if}
      {#if $profileData.selectedPlatforms.includes("steam")}
        <Rect
          {...configRect(55, 88 * 2, 578, 0)}
        />
      {/if}

      <!-- 武器アイコン -->
      {#each weapons as weapon, i}
        {#if $profileData.selectedWeapons[weapon]}
          <Rect
            {...configRect(368, 71 * (i % 7), 486, (i < 7 ? 0 : 78))}
          />
          {#if $profileData.selectedWeapons[weapon] > 1}
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
        bind:this={lineRef}
        points={configLine}
        stroke="blue"
        strokeWidth={10}
        opacity={0.5}
      />
    </Layer>
  </Stage>
</div>
