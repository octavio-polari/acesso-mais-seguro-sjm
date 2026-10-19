import NetInfo from "@react-native-community/netinfo";
import { addToQueue } from "./offlineQueue";

export async function safeFetch(url: string, options: RequestInit) {
  const state = await NetInfo.fetch();

  if (state.isConnected && state.isInternetReachable) {
    return fetch(url, options);
  }

  await addToQueue({ url, options });

  throw new Error("Sem conexão. Requisição armazenada.");
}