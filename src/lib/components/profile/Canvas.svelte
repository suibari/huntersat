<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from "svelte";
  import { Stage, Layer, Rect, Text, Image } from 'svelte-konva';

  export let hunterName = "";
  export let hunterRank = "-";
  export let selectedPlatforms: string[] = [];
  export let selectedWeapons: Record<string, number> = {};
  export let playTimeRange = [8, 22];
  export let comment = "";
  export let headerImage: string;

  let background: HTMLImageElement;
  let header: HTMLImageElement;

  const weapons = ["gs", "ls", "sns", "db", "hammer", "hh", "lance", "gl", "sa", "cb", "ig", "lbg", "hbg", "bow"];

  onMount(() => {
    const bg = document.createElement('img');
    bg.src = `${$page.url.origin}/card/cardbg.png`;
    bg.onload = () => {
      background = bg;
    }
  });

  $: {
    if (window && headerImage) {
      const hd = document.createElement('img');
      hd.src = headerImage;
      hd.onload = () => {
        header = hd;
      }
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
      width={900}
      height={1200}
      fill="pink",
    >
    </Rect>
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
  </Layer>

  <!-- アイコン系 -->
  <Layer>
    
  </Layer>
</Stage>
