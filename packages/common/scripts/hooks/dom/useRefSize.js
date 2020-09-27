import { onMounted, ref } from "@vue/composition-api";

export default function useRefSize(key, refs, immediate = false) {
  const size = ref({
    width: 0,
    height: 0,
  });

  const update = () => {
    const el = refs[key];
    if (!el) return;
    const rect = (el.$el || el).getBoundingClientRect();
    size.value = {
      width: rect.width,
      height: rect.height,
    };
  };

  immediate ? update() : onMounted(update);

  return size;
}
