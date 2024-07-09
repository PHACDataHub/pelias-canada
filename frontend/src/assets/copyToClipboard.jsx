// assets/copyToClipboard.js

export const copyToClipboard = (text, callback) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      if (callback) {
        callback();
      }
    })
    .catch((error) => {
      console.error('Failed to copy:', error);
      alert('Failed to copy to clipboard. Please try again.');
    });
};
