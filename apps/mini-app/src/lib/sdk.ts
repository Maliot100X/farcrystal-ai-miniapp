'use client';

import { sdk } from '@farcaster/miniapp-sdk';

export { sdk };

export const initMiniApp = async () => {
  // CRITICAL: Must call ready() or infinite loading screen
  await sdk.actions.ready();
  console.log('✅ Mini App initialized');
};

export const getUserContext = async () => {
  const context = await sdk.context;
  return context?.user;
};

export const openUrl = async (url: string) => {
  await sdk.actions.openUrl(url);
};

export const closeApp = async () => {
  await sdk.actions.close();
};

export const isInMiniApp = () => {
  return typeof sdk !== 'undefined' && sdk.context !== undefined;
};
