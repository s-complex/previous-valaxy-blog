<template>
    <Layout>
        <main class="main">
            <div class="container mx-auto p-3">
                <div class="grid grid-cols-1 lg:grid-cols-4 lg:gap-4 max-w-6xl m-auto">
                    <div class="lg:col-span-3 lg:mb-0">
                        <div>
                            <ArchivesList />
                        </div>
                    </div>

                    <div class="order-last lg:order-first lg:col-span-1">
                        <Sidebar />
                    </div>
                </div>
            </div>
        </main>
        <RightBottomButton />
    </Layout>
</template>