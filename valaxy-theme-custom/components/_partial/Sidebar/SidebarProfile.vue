<script setup lang="ts">
import { computed } from 'vue';
import type { Post, Categories } from 'valaxy';
import { useSiteConfig, useSiteStore, useCategories } from 'valaxy';
import { useThemeConfig } from '../../../composables';
const props = withDefaults(defineProps<{
    type?: string
    posts?: Post[]
    categories?: Categories[]
    curPage?: number
}>(), {
    curPage: 1,
})

const siteConfig = useSiteConfig();
const themeConfig = useThemeConfig();
const siteStore = useSiteStore();
const posts = computed(() => (
    props.posts || siteStore.postList).filter(post => import.meta.env.DEV ? true : !post.hide),
)
const categories = useCategories();
</script>

<template>
    <div class="card p-4">
            <div class="mb-1 flex flex-col justify-center items-center text-center">
                <img width="96" height="96" src="https://library.gxres.net/images/icons/avatar.webp"
                    class="rounded-full mb-2" alt="Restent's avatar">
                <p class="text-2xl mb-1">{{ siteConfig.author.name }}</p>
                <p class="text-sm mb-1">{{ themeConfig.author.slogan }}</p>
            </div>
            <nav class="grid grid-cols-2">
                <div class="text-center">
                    <div>
                        <p class="heading text-lg">{{ posts.length }}</p>
                        <p class="text-sm">文章</p>
                    </div>
                </div>
                <div class="text-center">
                    <div>
                        <p class="heading text-lg">{{ (Array.from(categories.children).length) }}</p>
                        <p class="text-sm">分类</p>
                    </div>
                </div>
            </nav>
        </div>
</template>