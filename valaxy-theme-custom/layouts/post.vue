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
        <main class="main">
            <div class="container mx-auto p-3">
                <div class="grid grid-cols-1 lg:grid-cols-4 lg:gap-4 max-w-6xl m-auto">
                    <div class="lg:col-span-3 md:mb-0">
                        <div>
                            <PostContent>
                                <RouterView />
                            </PostContent>
                        </div>
                    </div>

                    <div class="order-last lg:order-first lg:col-span-1">
                        <Sidebar>
                            <SidebarDesktopToc class="hidden lg:block" />
                        </Sidebar>
                    </div>
                </div>
            </div>
        </main>
        <RightBottomButton>
            <div class="block lg:hidden">
                <TocButton />
            </div>
        </RightBottomButton>
    </Layout>
</template>