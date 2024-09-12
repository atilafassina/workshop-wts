import { check } from "@tauri-apps/plugin-updater";
import { ask, message } from "@tauri-apps/plugin-dialog";
import { relaunch } from "@tauri-apps/plugin-process";

export async function checkForUpdates(onUserClick: false) {
  const update = await check();
  console.log("checking...");

  if (update?.available) {
    const yes = await ask(
      `
            Update to (${update.version}) is available.
            Release notes: ${update.body}`,
      {
        title: "Update NOW!!!",
        kind: "info",
        okLabel: "Update",
        cancelLabel: "Later",
      }
    );

    if (yes) {
      await update.downloadAndInstall();
      await relaunch();
    }
  }
  if (onUserClick) {
    await message("You are on the latest version.", {
      title: "No Update Found",
      kind: "info",
      okLabel: "OK",
    });
  }
}
