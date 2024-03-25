<script lang="ts" setup>
import { watch, nextTick, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router';
import Artalk from 'artalk'
import "artalk/dist/Artalk.css"
import { useFrontmatter } from 'valaxy'

const fm = useFrontmatter()
const el = ref<HTMLElement | null>(null)
const route = useRoute()


let artalk: Artalk

onMounted(() => {
    nextTick(() => {
        initArtalk(getConfByPage())
    })
})

watch(() => route.path, () => {
    nextTick(() => {
        artalk.update(getConfByPage())
        artalk.reload()
    })
})

onUnmounted(() => {
    artalk.destroy()
})

function initArtalk(conf: any) {
    artalk = Artalk.init({
        el: el.value,
        emoticons: '/assets/emoticons/default.json',
        gravatar: {
            mirror: 'https://cdn.libravatar.org/avatar/'
        },
        ...conf
    })

    loadExtraFuncs()
}

function getConfByPage() {
    return {
        pageKey: '' + route.path,
        pageTitle: fm.value.title,
        server: '',
        site: "Restent's Notebook",
        useBackendConf: true,
        locale: "auto",
    }
}

function loadExtraFuncs() {
    // 图片灯箱插件
    artalk.on('list-loaded', () => {
        document.querySelectorAll('.atk-comment .atk-content').forEach(($content) => {
            const imgEls = $content.querySelectorAll<HTMLImageElement>('img:not([atk-emoticon]):not([atk-lightbox])');
            imgEls.forEach((imgEl) => {
                imgEl.setAttribute('atk-lightbox', '')
                const linkEl = document.createElement('a')
                linkEl.setAttribute('class', 'atk-img-link')
                linkEl.setAttribute('href', imgEl.src)
                linkEl.setAttribute('data-src', imgEl.src)
                linkEl.append(imgEl.cloneNode())
                imgEl.replaceWith(linkEl)
            })
            // @ts-ignore
            if (imgEls.length) lightGallery($content, { selector: '.atk-img-link' })
        })
    })

    const htmlElement = document.querySelector('html');

    const setDarkMode = () => {
        const darkMode = htmlElement?.getAttribute('data-theme') === 'dark';
        artalk.setDarkMode(darkMode);
    }

    setDarkMode();  // 初始设置

    new MutationObserver((mList) => {
        mList.forEach((m) => {
            if (m.attributeName !== 'data-theme') return;
            setDarkMode();
        })
    });
}
</script>

<template>
    <div class="card">
        <div class="card-content">
            <ClientOnly>
                <div ref="el" class="mt-5"></div>
            </ClientOnly>
        </div>
    </div>
</template>