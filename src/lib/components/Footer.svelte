<script lang="ts">
  import SimpleIconsBluesky from "./icons/SimpleIconsBluesky.svelte";
  import SimpleIconsGithub from "./icons/SimpleIconsGithub.svelte";
</script>

<footer class="bg-base text-accent p-4">
  <div class="container mx-auto flex justify-between items-center">
    <p class="text-sm">&copy; 2025 HuntersAt</p>
    <div class="flex gap-4">
      <a 
        href="https://bsky.app/profile/suibari.com" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="hover:opacity-80 transition-opacity"
        aria-label="View on GitHub"
      >
        <SimpleIconsBluesky class="w-6 h-6 text-accent" />
      </a>
      <a 
        href="https://github.com/suibari/huntersat" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="hover:opacity-80 transition-opacity"
        aria-label="View on GitHub"
      >
        <SimpleIconsGithub class="w-6 h-6 text-accent" />
      </a>
    </div>
  </div>
</footer>
