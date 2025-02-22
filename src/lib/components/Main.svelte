<script lang="ts">
  import InputForm from "./profile/InputForm.svelte";
  import Canvas from "./profile/Canvas.svelte";

  let profileData = {
    hunterName: "",
    hunterRank: "-",
    selectedPlatforms: [],
    selectedWeapons: {},
    playTimeRange: [8, 22],
    comment: "",
    headerImage: "",
    backgroundColor: "",
  };

  function handleProfileUpdate(event: App.ProfileUpdateEvent) {
    profileData = { ...event.detail };
  }
</script>

<InputForm on:updateProfile={handleProfileUpdate} />
<Canvas {...profileData} />
