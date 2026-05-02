export const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out Sync-Tunes 🎶",
          text:
            "I'm jamming live on SyncTunes right now and would love for you to join in\n Let's vibe together, share some beats, and make some awesome music 🎧🎸🥁 /n Join with the room code: " +
            sessionStorage.getItem("roomCode") +
            " or click the link below:",
          url: window.location.href, // or your app URL e.g., 'https://sync-tunes.vercel.app'
        })
        .then(() => console.log("Thanks for sharing!"))
        .catch((err) => console.error("Error sharing:", err));
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };