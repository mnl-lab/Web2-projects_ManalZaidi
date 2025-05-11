<template>
    <div>
        <navbar></navbar>
    </div>
</template>



<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { fetchUserProfile } from '#imports';
const route = useRouter();

const user = ref(null);



onMounted(async () => {
    const user = await fetchUserProfile()

  console.log('Username:', user.display_name)
  console.log('User ID:', user.id)
  console.log('Profile image:', user.images?.[0]?.url || 'No image')
})



</script>