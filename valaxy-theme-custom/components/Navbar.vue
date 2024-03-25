<script setup lang="ts">
import { useSiteConfig } from 'valaxy'
import { useThemeConfig } from '../composables'
import { ref, onMounted } from 'vue';

const siteConfig = useSiteConfig();
const themeConfig = useThemeConfig();
const isActive = ref(false);
const darkThemeButton = ref<HTMLElement | null>(null);
const lightThemeButton = ref<HTMLElement | null>(null);
const systemThemeButton = ref<HTMLElement | null>(null);

let userPreference = 'system';

onMounted(() => {
    if (typeof window !== 'undefined') {
        const htmlElement = document.documentElement;

        const setTheme = (theme: string) => {
            if (theme === 'light' || theme === 'dark') {
                htmlElement.setAttribute('data-theme', theme);
            } else {
                htmlElement.removeAttribute('data-theme');
            }
            localStorage.setItem('theme', theme);
            userPreference = theme;
            updateButtonClass();
        }

        const setDarkTheme = () => {
            setTheme('dark');
        }

        const setLightTheme = () => {
            setTheme('light');
        }

        const setSystemTheme = () => {
            setTheme('system');
        }

        const updateButtonClass = () => {
            darkThemeButton.value?.classList.remove('is-info');
            lightThemeButton.value?.classList.remove('is-info');
            systemThemeButton.value?.classList.remove('is-info');

            switch (userPreference) {
                case 'dark':
                    darkThemeButton.value?.classList.add('is-info');
                    break;
                case 'light':
                    lightThemeButton.value?.classList.add('is-info');
                    break;
                case 'system':
                    systemThemeButton.value?.classList.add('is-info');
                    break;
            }
        }

        const storedTheme = localStorage.getItem('theme') || 'system';
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(storedTheme || systemTheme);

        darkThemeButton.value?.addEventListener("click", setDarkTheme);
        lightThemeButton.value?.addEventListener("click", setLightTheme);
        systemThemeButton.value?.addEventListener("click", setSystemTheme);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (userPreference === 'system') {
                const newTheme = e.matches ? 'dark' : 'light';
                setTheme(newTheme);
            }
        });
    }
});

</script>

<template>
    <div class="navbar-container">
        <div class="navbar max-w-6xl mx-auto">
            <div class="navbar-brand flex justify-center lg:justify-left">
                <RouterLink class="navbar-item" to="/">
                    <img :src="siteConfig.favicon" width="28" height="28" alt="Site favicon">
                    <div class="ml-2 font-medium">{{ siteConfig.title }}</div>
                </RouterLink>
            </div>
            <div class="navbar-menu">
                <div class="navbar-start">
                    <RouterLink class="navbar-item" to="/" aria-label="Site Index">
                        首页
                    </RouterLink>
                    <span class="flex flex-row" v-for="page in themeConfig.pages">
                        <AppLink class="navbar-item" v-if="page.url" :to="page.url" :aria-label="page.name">
                            {{ page.name }}
                        </AppLink>
                    </span>
                </div>
                <div class="navbar-end">
                    <span class="flex flex-row" v-for="item in themeConfig.quickAccess">
                        <a class="navbar-item" :href="item.url" :aria-label="item.name">
                            <span class="icon text-xl" :class="item.icon" />
                        </a>
                    </span>
                    <button class="navbar-item" @click="isActive = true" aria-label="Switch theme manually">
                        <div class="icon text-xl i-ic-baseline-contrast" />
                    </button>
                </div>
            </div>
            <div class="flex justify-center overflow-auto lg:hidden">
                <RouterLink class="navbar-item" to="/" aria-label="Site Index">
                    首页
                </RouterLink>
                <span class="flex flex-row" v-for="page in themeConfig.pages">
                    <AppLink class="navbar-item" v-if="page.url" :to="page.url" :aria-label="page.name">
                        {{ page.name }}
                    </AppLink>
                </span>

                <span class="flex flex-row" v-for="item in themeConfig.quickAccess">
                    <AppLink class="navbar-item" :href="item.url" :aria-label="item.name">
                        <div class="icon text-xl" :class="item.icon" />
                    </AppLink>
                </span>
                <button class="navbar-item" @click="isActive = true" aria-label="Switch theme manually">
                    <div class="icon text-xl i-ic-baseline-contrast" />
                </button>
            </div>
        </div>
    </div>
    <div class="modal z-50" :class="{ 'is-active': isActive }">
        <div class="modal-background" @click="isActive = false"></div>
        <div class="card m-3 max-w-md">
            <div class="card-content">
                <div class="text-lg text-center font-semibold">选择主题</div>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3 p-3">
                    <button class="button" :class="{ 'is-info': userPreference === 'dark' }" ref="darkThemeButton">
                        <span class="icon">
                            <div class="i-ic-baseline-dark-mode" />
                        </span>
                        <span>保持深色</span>
                    </button>
                    <button class="button" :class="{ 'is-info': userPreference === 'light' }" ref="lightThemeButton">
                        <span class="icon">
                            <div class="i-ic-baseline-light-mode" />
                        </span>
                        <span>保持浅色</span>
                    </button>
                    <button class="button" :class="{ 'is-info': userPreference === 'system' }" ref="systemThemeButton">
                        <span class="icon">
                            <div class="i-ic-baseline-desktop-windows" />
                        </span>
                        <span>跟随系统</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>