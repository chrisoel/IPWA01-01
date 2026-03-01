<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div class="app-shell d-flex min-vh-100 flex-column">
    <AppHeader />

    <main class="flex-grow-1">
      <div class="container py-4 py-lg-5">
        <RouterView />
      </div>
    </main>

    <AppFooter />
  </div>
</template>
