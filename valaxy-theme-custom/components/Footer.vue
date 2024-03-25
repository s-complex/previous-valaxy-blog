<script setup lang="ts">
import { useSiteConfig } from 'valaxy'
import { useThemeConfig } from '../composables';

const siteConfig = useSiteConfig();
const themeConfig = useThemeConfig();
</script>

<template>
    <footer class="footer m-auto">
        <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-2">
                <div class="text-center lg:text-left">Copyright © {{ themeConfig.footer.since }} - {{ new
                    Date().getFullYear() }} <a href="/">{{ siteConfig.title }}</a></div>
                <div class="text-center lg:text-right">Built with <a href="https://valaxy.site">Valaxy</a> by SliverRiver
                </div>
            </div>
        </div>
    </footer>
</template>