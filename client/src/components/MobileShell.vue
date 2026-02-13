<script setup>
import { onMounted } from "vue";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

/**
 * MobileShell Component
 *
 * Enforces a mobile-first layout on all devices.
 * - Sets up GSAP ScrollTrigger to use the inner scrollable container by default.
 */

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  // Tell GSAP to listen to this container instead of the window/body
  ScrollTrigger.defaults({
    scroller: "#mobile-scroll-container",
  });

  // Refresh to ensure any existing triggers are aware
  ScrollTrigger.refresh();
});
</script>

<template>
  <!-- Outer Container: Handles desktop centering and background -->
  <div
    class="min-h-screen w-full bg-transparent flex justify-center items-center overflow-hidden"
  >
    <!-- Inner Shell: The "Phone" frame -->
    <div
      id="mobile-scroll-container"
      class="relative w-full max-w-[430px] h-[90vh] bg-transparent overflow-y-auto overflow-x-hidden flex flex-col /* Mobile (Small Screens) overrides: */ max-[500px]:max-w-full max-[500px]:h-[100dvh] max-[500px]:shadow-none max-[500px]:rounded-none border border-[#222222]"
    >
      <!-- Safe Area padding wrappers could go here if needed globally, 
          but usually page content handles its own padding or we wrap slot.
          Here we provide a slot that fills the shell.
            -->
      <main
        class="flex-1 w-full pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]"
      >
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Ensure the body doesn't scroll on desktop if we want just the phone to scroll,
   but typically we let the window scroll. 
   If we wanted "in-phone" scrolling only:
   1. Set Outer Container max-h-screen, overflow-hidden
   2. Set Inner Shell overflow-y-auto
   
   For this requirements (simple shell), we stick to window scrolling usually, 
   but requirements said "Mobile-only layout shell", "min-h-[100vh]".
   
   If we want the "phone" to be always visible and centered, and CONTENT scrolls inside it:
*/
</style>
