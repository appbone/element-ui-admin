<template>
    <div class="main-content">
        <RouterBreadcrumb class="main-content__router-breadcrumb"></RouterBreadcrumb>
        <router-view class="main-content__router-view"></router-view>
    </div>
</template>
<script>
    import RouterBreadcrumb from 'lib/app/router-breadcrumb/router-breadcrumb.vue'

    export default {
        data() {
            return {
            };
        },
        components: {
            RouterBreadcrumb
        }
    };
</script>
<style>
    .main-content {
        margin-left: 12px;
        margin-right: 12px;
        height: 100%;
    }
    .main-content__router-breadcrumb {
        padding-top: 18px;
        padding-bottom: 18px;
    }
    .main-content__router-view {
        min-height: calc(100% - 50px - 12px); /* 减去面包屑的高度和底部预留的 margin-bottom 高度 */
        padding: 10px;
        margin-bottom: 12px;
        box-sizing: border-box;
        background-color: #fff;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.117647), 0 0 6px 0 rgba(0, 0, 0, 0.0392157);
    }
</style>