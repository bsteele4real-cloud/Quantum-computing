// Show or hide the transaction dialog. The markup uses both the hidden
// attribute and a .show class; browsers that style [hidden] with
// `display: none !important` ignore .show unless hidden is cleared.
function setDialogOpen(dialog, open) {
  if (!dialog) return dialog;
  if (open) {
    dialog.hidden = false;
    if (dialog.classList) dialog.classList.add('show');
  } else {
    if (dialog.classList) dialog.classList.remove('show');
    dialog.hidden = true;
  }
  return dialog;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setDialogOpen };
}
if (typeof window !== 'undefined') {
  window.setDialogOpen = setDialogOpen;
}
