import { createEffect, createSignal, onMount } from "solid-js";
import logo from "./assets/logo.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import { ask } from "@tauri-apps/plugin-dialog";

function App() {
  const [greetMsg, setGreetMsg] = createSignal("");
  const [name, setName] = createSignal("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name: name() }));
  }

  onMount(async () => {
    const response = await ask("do you like Tauri?", {
      title: "Native Dialog from JS",
      okLabel: "YES",
      cancelLabel: "NOT YET",
    });

    console.log(response);
  });

  createEffect(async () => {
    const hasPermissions = await isPermissionGranted();

    if (!hasPermissions) {
      const permission = await requestPermission();
      if (permission === "granted") {
        console.log("Permission granted");

        sendNotification({
          title: "Hello World",
          body: "This is a notification from Tauri!",
        });
      } else {
        console.log("Permission denied");
      }
    }
  });

  return (
    <div class="container">
      <h1>Welcome to Tauri!</h1>

      <div class="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" class="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={logo} class="logo solid" alt="Solid logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and Solid logos to learn more.</p>

      <form
        class="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg()}</p>
    </div>
  );
}

export default App;
