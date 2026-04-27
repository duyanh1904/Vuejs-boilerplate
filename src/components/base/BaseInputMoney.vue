<template>
  <div class="flex flex-col gap-2 w-full">
    <label :for="id" class="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
      {{ label }}
    </label>

    <div class="relative group">
      <input :id="id" type="number" :value="modelValue" @input="onInput" :placeholder="placeholder" class="w-full px-5 py-4 rounded-2xl border-2 transition-all duration-300
               bg-slate-50 border-transparent text-slate-800 font-semibold text-lg
               focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none
               hover:bg-slate-100 placeholder:text-slate-300 placeholder:font-normal

               /* --- MAGIC TRICK ĐỂ DISABLE SPINNER --- */
               [appearance:textfield]
               [&::-webkit-outer-spin-button]:appearance-none
               [&::-webkit-inner-spin-button]:appearance-none" />

      <div
        class="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none group-focus-within:text-blue-500 transition-colors">
        VNĐ
      </div>
    </div>

    <small v-if="hint" class="text-slate-400 ml-1 italic">{{ hint }}</small>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  label: string;
  modelValue: number | string | null;
  placeholder?: string;
  hint?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void;
}>();

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const val = target.value === '' ? null : Number(target.value);
  emit('update:modelValue', val);
};
</script>