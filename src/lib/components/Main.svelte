<script lang="ts">
  import InputForm from "./profile/InputForm.svelte";
  import Canvas from "./profile/Canvas.svelte";

  let profileData: App.ProfileData = {
    hunterName: "",
    hunterID: "",
    hunterRank: "-",
    selectedPlatforms: [],
    selectedWeapons: {},
    playTimeRange: [8, 22],
    comment: "",
    headerImage: "",
    backgroundColor: "",
  };

  function handleProfileUpdate(event: CustomEvent<App.ProfileData>) {
    profileData = { ...event.detail };
  }
</script>

<div class="flex flex-col xl:flex-row items-center justify-center">
  <InputForm on:updateProfile={handleProfileUpdate} />
  <Canvas {...profileData} />
</div>
<div class="flex items-center justify-center">
  <button class="mt-4 p-2 bg-blue-500 text-white rounded">Save & Post</button>
</div>
