<template>
  <div class="toast-stack" aria-live="polite">
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        :class="['toast', 'show', 'app-toast', `text-bg-${variants[t.type] || 'info'}`]"
        :role="t.type === 'error' ? 'alert' : 'status'"
        @click="dismiss(t.id)"
      >
        <div class="toast-body d-flex align-items-start gap-2">
          <i :class="['bi', icons[t.type] || icons.info]"></i>
          <span class="flex-grow-1">{{ t.message }}</span>
          <button type="button" class="btn-close btn-close-white" aria-label="Close"></button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ToastContainer',
  data() {
    return {
      // Toast type -> Bootstrap color
      variants: { success: 'success', error: 'danger', warning: 'warning', info: 'primary' },
      icons: {
        success: 'bi-check-circle-fill',
        error: 'bi-x-circle-fill',
        warning: 'bi-exclamation-triangle-fill',
        info: 'bi-info-circle-fill'
      }
    };
  },
  computed: {
    ...mapGetters('toasts', { toasts: 'getToasts' })
  },
  methods: {
    ...mapActions('toasts', ['dismiss'])
  }
};
</script>

<style scoped>
.toast-stack {
  position: fixed;
  top: 1rem;
  right: 1rem;
  /* Above every overlay, including the QR scanner modal in Applicants (9999) */
  z-index: 10001;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: calc(100vw - 2rem);
  pointer-events: none;
}

.app-toast {
  pointer-events: auto;
  cursor: pointer;
  width: 350px;
  max-width: 100%;
}

/* Warning toasts use dark text, so use the dark close button */
.text-bg-warning .btn-close {
  filter: none;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
