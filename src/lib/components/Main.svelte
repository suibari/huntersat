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
  };

  // 型を定義
  type ProfileUpdateEvent = CustomEvent<{
    hunterName: "";
    hunterRank: "-";
    selectedPlatforms: [];
    selectedWeapons: {};
    playTimeRange: [8, 22];
    comment: "";
    headerImage: string;
  }>;

  function handleProfileUpdate(event: ProfileUpdateEvent) {
    profileData = { ...event.detail };
  }
</script>

<InputForm on:updateProfile={handleProfileUpdate} />
<Canvas {...profileData} />
