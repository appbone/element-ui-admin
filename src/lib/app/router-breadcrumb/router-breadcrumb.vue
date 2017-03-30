<template>
    <el-breadcrumb separator="/" class="router-breadcrumb">
        <el-breadcrumb-item v-for="route in $route.matched" v-if="route.path != '/'" :to="route.path" :key="route.path">{{ route.meta.name }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script>
    export default {
        data() {
            return {
            };
        }
    };
</script>
<style>
    .router-breadcrumb {
        font-size: 14px;
    }
</style>