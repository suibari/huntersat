// ------------------------
// web share API
// ------------------------
export const handleWebShare = async (blob: Blob, text: string) => {
  if (navigator.share) {
    // Web Share API をサポートしている場合
    try {
      const file = new File([blob], "hunter-profile.png", { type: "image/png" });

      await navigator.share({
        title: "Hunters Profile",
        files: [file],
        text,
        // url: shareUrl, // URLが優先され、textが無視されることが多い
      });
    } catch (err) {
      console.error("[ERROR] Sharing failed:", err);
    }
  } else {
    // フォールバック：Bluesky共有画面を新しいタブで開く
    const intentUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`;
    window.open(intentUrl, "_blank");
  }
};
