<script setup lang="ts">
import { useFrontmatter } from 'valaxy';
import { usePrevNext } from 'valaxy';
import { useThemeConfig } from '../../composables';

const [prev, next] = usePrevNext()
const frontmatter = useFrontmatter();
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
        <div class="card-image">
            <figure class="h-80 relative">
                <img class="absolute top-0 left-0 w-full h-full object-cover"
                    :src="frontmatter.banner ?? themeConfig.postBanner" alt="Post banner image">
            </figure>
        </div>
        <div class="card-content">
            <p class="text-2xl mb-2">{{ frontmatter.title }}</p>
            <p class="text-base">{{ formatDate(frontmatter.date as Date) }} &#x2022; {{ frontmatter.categories ??
                        "未分类"
                }}
            </p>
            <br>
            <div class="content">
                <div>{{ frontmatter.description }}</div>
                <hr>
                <div class="p-4">
                    <slot />
                </div>
            </div>
        </div>
        <Copyright />
    </div>
    <div class="my-4">
        <div class="grid grid-cols-1 md:grid-cols-2">
            <div class="text-left">
                <RouterLink class="button is-ghost" v-if="prev" :to="prev.path || ''" :title="prev.title">
                    <span class="icon i-ic-baseline-arrow-back truncate"></span>
                    <span>{{ prev.title }}</span>
                </RouterLink>
            </div>
            <div class="text-right">
                <RouterLink class="button is-ghost" v-if="next" :to="next.path || ''">
                    <span>{{ next.title }}</span>
                    <span class="icon i-ic-baseline-arrow-forward"></span>
                </RouterLink>
            </div>
        </div>
    </div>
    <Donate class="mb-4" />
    <Comment />
</template>