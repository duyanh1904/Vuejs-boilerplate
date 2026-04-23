<template>
  <div class="bg-slate-50 min-h-screen w-full font-sans text-slate-800 pb-12">

    <header class="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm rounded-xl">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <h1 class="text-xl font-bold text-slate-900 hidden sm:block">Quản Lý Chi Tiêu</h1>

          <nav class="flex space-x-1 sm:space-x-4 w-full sm:w-auto">
            <button @click="activeTab = 'home'"
              class="flex-1 sm:flex-none px-4 py-4 text-sm font-medium border-b-2 transition-colors duration-200 text-center"
              :class="activeTab === 'home' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'">
              Ghi chép
            </button>
            <button @click="activeTab = 'report'"
              class="flex-1 sm:flex-none px-4 py-4 text-sm font-medium border-b-2 transition-colors duration-200 text-center"
              :class="activeTab === 'report' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'">
              Báo cáo chi tiết
            </button>
          </nav>
        </div>
      </div>
    </header>

    <main class="pt-8">
      <KeepAlive>
        <component :is="activeTab === 'home' ? TabStoreFinance : TabReportFinance" />
      </KeepAlive>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useFinance } from '../composables/useFinance';
import TabStoreFinance from "@/components/TabStoreFinance.vue";
import TabReportFinance from "@/components/TabReportFinance.vue";
import type { TabId } from '@/types/tabs';
import type { Ref } from 'vue';

// Explicitly type the shared activeTab ref for clarity
const { activeTab } = useFinance() as { activeTab: Ref<TabId> };
</script>

<style scoped>
/* Hiệu ứng chuyển tab mượt mà */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>