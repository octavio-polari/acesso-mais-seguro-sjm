import NetInfo from "@react-native-community/netinfo";
import { processQueue } from "./offlineQueue";

let queue: (() => void) | null = null;

export function startNetworkListener() {
  if (queue) return;

  queue = NetInfo.addEventListener(state => {
    if (state.isConnected && state.isInternetReachable) {
      processQueue();
    }
  });
}

export function stopNetworkListener() {
  if (queue) {
    queue();
    queue = null;
  }
}