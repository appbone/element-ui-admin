<template>
    <el-menu :default-active="$route.path" :default-openeds="level1" theme="dark" router>
        <template v-for="route in $router.options.routes" v-if="!route.meta.hidden">
            <!-- 如果没有子路由或者只有一个子路由的, 就不生成子菜单 -->
            <el-menu-item v-if="!route.children || route.children.length == 1" :index="route.path" :key="route.path">
                <i class="el-icon-menu"></i>{{ route.meta.name }}
            </el-menu-item>
            <el-submenu v-else :index="route.path">
                <template slot="title"><i class="el-icon-menu"></i>{{ route.meta.name }}</template>
                <el-menu-item v-for="child in route.children" v-if="!child.meta.hidden" :index="route.path + '/' + child.path" :key="route.path + '/' + child.path">{{ child.meta.name }}</el-menu-item>
            </el-submenu>
        </template>
    </el-menu>
</template>
<script>
    export default {
        data() {
            return {
            };
        },
        computed: {
            level1() { // 默认打开所有一级菜单
                return this.$router.options.routes.map(function(route) {
                    return route.path;
                });
            }
        }
    };
</script>
<style>
</style>