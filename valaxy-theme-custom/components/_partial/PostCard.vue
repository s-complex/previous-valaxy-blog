<script setup lang="ts">
import { useThemeConfig } from '../../composables';
import type { Post } from 'valaxy'

defineProps<{
    post: Post
}>()

const themeConfig = useThemeConfig();
const formatDate = (date: string | number | Date) => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    return new Date(date).toLocaleDateString("zh-CN", options);
};
</script>

<template>
    <div class="card">
        <RouterLink v-if="post.path" :to="post.path">
            <div class="card-image">
                <figure class="h-80 relative">
                    <img class="absolute top-0 left-0 w-full h-full object-cover"
                        :src="post.banner ?? themeConfig.postBanner" alt="Post banner image">
                </figure>
            </div>
        </RouterLink>
        <div class="card-content">
            <RouterLink v-if="post.path" :to="post.path">
                <p class="text-2xl mb-2">{{ post.title }}</p>
            </RouterLink>
            <p class="text-base">{{ post.description }}</p>
            <hr>
            <div class="grid grid-cols-3">
                <p class="text-left col-span-2">{{ formatDate(post.date as Date) }} &#x2022; {{ post.categories
            ?? '未分类' }}</p>
                <p class="text-right">
                    <RouterLink v-if="post.path" :to="post.path">
                        阅读全文
                    </RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>