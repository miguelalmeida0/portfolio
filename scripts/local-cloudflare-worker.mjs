import worker from '../.svelte-kit/cloudflare/_worker.js';
import { localAssetRange } from './lib/local-asset-range.mjs';

// Local-only adapter: execute the actual compiled Pages worker and preserve its
// routing. Normalize only the emulator asset binding's missing Range support.
export default {
  fetch(request, env, context) {
    const assets = env.ASSETS;
    return worker.fetch(request, {
      ...env,
      ASSETS: { async fetch(input, init) {
        const assetRequest = new Request(input, init);
        return localAssetRange(assetRequest, await assets.fetch(assetRequest));
      } }
    }, context);
  }
};
