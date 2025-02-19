<script lang="ts">
    import { Avatar } from "flowbite-svelte";

  export let hunterName = "";
  export let hunterID = "";

  let imageSrc: string | null = null;

  function onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      cropImage(url); // 画像の中央クロップ処理
    }
  }

  function cropImage(url: string) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const headerAspectRatio = 3; // 例: 3:1 のアスペクト比
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      
      const cropWidth = img.width;
      const cropHeight = img.width / headerAspectRatio;
      const startX = 0;
      const startY = (img.height - cropHeight) / 2; // 中央基準でクロップ

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      ctx.drawImage(img, startX, startY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

      imageSrc = canvas.toDataURL("image/png");
    };
  }
</script>

<div class="header-container">
  <label class="header-image" style="background-image: url({imageSrc || '/header/default_header.png'})">
    <input type="file" accept="image/*" on:change={onFileChange} hidden />
    <div class="gradient-overlay"></div>
  </label>

  <div class="header-content">
    <label class="profile-pic">
      <input type="file" accept="image/*" hidden />
      <Avatar />
    </label>
    <div class="name-container">
      <input bind:value={hunterName} class="name-input" placeholder="Hunter Name" />
      <input bind:value={hunterID} class="id-input" placeholder="Hunter ID" />
    </div>
  </div>
</div>

<style>
  .header-container {
    position: relative;
    width: 100%;
    aspect-ratio: 2 / 1;
    overflow: hidden;
    border-radius: 12px;
  }
  
  .header-image {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    cursor: pointer;
  }
  
  .gradient-overlay {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%);
  }

  .header-content {
    position: absolute;
    bottom: 10px;
    left: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .name-container {
    display: flex;
    flex-direction: column;
  }

  .name-input, .id-input {
    background: transparent;
    border: none;
    font-size: 18px;
    color: white;
    outline: none;
  }
</style>
