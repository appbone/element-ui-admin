<template>
    <div>
        <el-tabs v-model="activeTab">
            <el-tab-pane label="进行中" name="tab1">
                <p>示例通过 vue-resource 获取接口数据</p>
                <el-table style="width: 100%" :data="tableData" v-loading.body="loading">
                    <el-table-column prop="name" label="Name" width="200"></el-table-column>
                    <el-table-column prop="value" label="Value"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="未开始" name="tab2">
                <p>未开始</p>
            </el-tab-pane>
            <el-tab-pane label="已结束" name="tab3">
                <p>已结束</p>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                activeTab: 'tab1',
                tableData: [],
                loading: true
            };
        },
        created() {
            this.$http({
                url: 'http://httpbin.org/headers'
            }).then(function(response) {
                var headers = response.body.headers;
                for (var key in headers) {
                    this.tableData.push({
                        name: key,
                        value: headers[key]
                    });
                }
                this.loading = false;
            });
        }
    };
</script>
<style>

</style>