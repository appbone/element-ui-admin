<template>
    <div>
        <el-form :model="payInfo" label-width="120px" style="width: 50%;">
            <el-form-item label="账户余额">
                {{ payInfo.balance }} 元
            </el-form-item>
            <el-form-item label="充值金额">
                <el-input v-model="payInfo.recharge" placeholder="元" type="number"></el-input>
            </el-form-item>
            <el-form-item label="支付方式">
                <el-radio-group v-model="payInfo.payType">
                    <el-radio label="alipay">支付宝支付</el-radio>
                    <el-radio label="wxpay">微信支付</el-radio>
                    <el-radio label="bank">公司转账</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">立即充值</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                payInfo: {
                    balance: 10,
                    recharge: 100,
                    payType: 'alipay'
                }
            };
        }
    };
</script>
<style>

</style>