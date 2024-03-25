<script setup lang="ts">
import { useAppStore } from 'valaxy'
import { onMounted } from 'vue'

const app = useAppStore()
onMounted(() => {
    app.showLoading = false
})
</script>

<template>
    <Layout>
        <main v-if="app.showLoading" class="main">
            <div class="flex justify-center items-center h-screen">
                <div class="grid text-center">
                    <div class="text-2xl font-medium">请稍候</div>
                    <progress class="progress is-medium is-info my-3" max="100">60%</progress>
                    <p>你访问的页面可能存在，但是服务器返回了 HTTP 404 状态码。</p>
                    <p>请等待 Valaxy 加载完毕...</p>
                </div>
            </div>
        </main>
        <main v-else class="main">
            <div class="flex justify-center items-center h-screen">
                <div class="grid content text-center">
                    <h1>Oops!</h1>
                    <p>你想访问的页面可能已经更名或不存在。</p>
                    <p>若有任何疑问，欢迎 <a href="https://library.gxres.net/contact.html">联系我</a> 了解具体情况。</p>
                    <RouterLink class="button" to="/">返回主页</RouterLink>
                </div>
            </div>
        </main>
    </Layout>
</template>