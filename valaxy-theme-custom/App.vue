<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { onMounted } from 'vue';

useHead({
    link: [
        {
            rel: 'canonical',
            href: 'https://blog.gxres.net'
        },
        {
            rel: 'preconnect',
            href: 'https://i.yecdn.com'
        }
    ]
})

onMounted(async () => {
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://umami.slirv.vip/script.js'
    script.dataset.websiteId = 'a1102895-db17-4356-8d49-355b6fef337e'
    document.head.appendChild(script)

    await import('@fontsource/roboto/400.css')
    await import('@fontsource/jetbrains-mono/400.css')
})
</script>