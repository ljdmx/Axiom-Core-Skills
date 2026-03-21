import { ref } from 'vue';

// #ifdef HARMONY
// @ts-ignore
import vibrator from '@ohos.vibrator';
// #endif

/**
 * useHaptics Composables (V2 with HarmonyOS Next Fallback)
 * 
 * Provides tactile and haptic feedback to fulfill the 5-Sense Synergy Protocol.
 * Maps high-level emotional interactions to native uni.vibrateShort API and web fallbacks.
 * Specifically hardened for ArkTS compatibility.
 */

export function useHaptics() {
  const isEnabled = ref(true);

  const triggerVibrate = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!isEnabled.value) return;

    // #ifdef HARMONY
    try {
      if (typeof vibrator !== 'undefined') {
        vibrator.startVibration({
          type: 'time',
          duration: type === 'light' ? 15 : type === 'medium' ? 30 : 60,
        }, {
          id: 0,
          usage: 'touch'
        }).then(() => {
          console.log('[Haptics] HarmonyOS vibration success');
        }).catch((err) => {
          console.warn('[Haptics] HarmonyOS vibration failed', err);
        });
        return; // Exit early if HarmonyOS API handles it
      }
    } catch (e) {
      console.warn('[Haptics] Failed invoking @ohos.vibrator', e);
    }
    // #endif

    // #ifdef APP-PLUS || MP
    // Native implementations using standard uni-app APIs
    try {
      if (typeof uni !== 'undefined' && uni.vibrateShort) {
        uni.vibrateShort({
          success: () => console.log(`[Haptics] Triggered ${type} vibration`),
          fail: () => console.warn('[Haptics] Vibration failed or unsupported')
        });
      }
    } catch (e) {
      console.warn('[Haptics] Error triggering native vibration', e);
    }
    // #endif

    // #ifdef H5
    // Fallback for Web API
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        switch (type) {
          case 'light':
            navigator.vibrate(10);
            break;
          case 'medium':
            navigator.vibrate(25);
            break;
          case 'heavy':
            navigator.vibrate(50);
            break;
        }
      }
    } catch (e) {
      // Ignore on desktop/unsupported browsers
    }
    // #endif
  };

  const hapticSelection = () => triggerVibrate('light');
  const hapticSuccess = () => triggerVibrate('medium');
  const hapticError = () => {
    // #ifdef HARMONY
    try {
      if (typeof vibrator !== 'undefined') {
        vibrator.startVibration({ type: 'time', duration: 100 }, { id: 0, usage: 'alarm' });
        return;
      }
    } catch (e) {}
    // #endif

    // #ifdef APP-PLUS || MP
    if (typeof uni !== 'undefined' && uni.vibrateLong) {
      uni.vibrateLong({});
    } else {
      triggerVibrate('heavy');
    }
    // #endif
    
    // #ifdef H5
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }
    // #endif
  };

  return {
    hapticSelection,
    hapticSuccess,
    hapticError,
    isEnabled
  };
}
