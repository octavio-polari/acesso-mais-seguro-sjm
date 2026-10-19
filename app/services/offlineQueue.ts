import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from 'react-native';

const QUEUE_KEY = "OFFLINE_REQUEST_QUEUE";
let isProcessing = false;

type OfflineRequest = {
  url: string;
  options: RequestInit;
};

export async function addToQueue(request: OfflineRequest) {
  const stored = await AsyncStorage.getItem(QUEUE_KEY);
  const queue: OfflineRequest[] = stored ? JSON.parse(stored) : [];

  queue.push(request);

  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const stored = await AsyncStorage.getItem(QUEUE_KEY);
    if (!stored) return;

    const queue = JSON.parse(stored);
    const remainingQueue = [];
    const trueQueue = [];

    for (const request of queue) {
      trueQueue.push(request)
      try {
        await fetch(request.url, request.options);
      } catch {
        remainingQueue.push(request);
      }
    }

    ToastAndroid.show(`${trueQueue.length} Emails Compartilhados! ✅`, ToastAndroid.SHORT);

    if (remainingQueue.length === 0) {
      await AsyncStorage.removeItem(QUEUE_KEY);
    } else {
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remainingQueue));
    }

    for (const _ of trueQueue) {
      trueQueue.pop();
    }
  } finally {
    isProcessing = false;
  }
}