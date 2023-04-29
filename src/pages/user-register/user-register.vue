<template>
    <uni-section title="新用户注册" type="line">
        <view class="example">
            <!-- 基础表单校验 -->
            <uni-forms ref="registerForm" :rules="rules" :modelValue="formData">
                <view class="register-form-items">
                    <uni-forms-item label="姓名" required name="name">
                        <uni-easyinput v-model="formData.name" placeholder="请输入姓名" />
                    </uni-forms-item>
                </view>

                <view class="register-form-items">
                    <uni-forms-item label="手机号" required name="phoneNumber">
                        <uni-easyinput v-model="formData.phoneNumber" placeholder="请输入手机号码" />
                    </uni-forms-item>
                </view>

            </uni-forms>
            <button type="warn" @click="submit('registerForm')">注册</button>
        </view>
    </uni-section>
</template>

<script setup>
import { onLoad, onReady } from '@dcloudio/uni-app';
import { ref } from 'vue';

const openid = ref('')

const registerForm = ref(null)
const formData = ref({
    name: '',
    phoneNumber: ''
})
const rules = ref({
    name: {
        rules: [{
            required: true,
            errorMessage: '请输入年龄',
        },
        {
            minLength: 2,
            maxLength: 5,
            errorMessage: '姓名长度在 {minLength} 到 {maxLength} 个字符',
        }]
    },
    phoneNumber: {
        rules: [{
            required: true,
            errorMessage: '请输入手机号码',
        },
        {
            pattern: '^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\\d{8}$',
            errorMessage: '请输入正确的手机号码',
        }
        ]
    },

})

function submit() {
    registerForm.value.validate().then(res => {
        console.log('表单数据信息：', res)
        let { name, phoneNumber } = res
        uni.showLoading()
        wx.cloud.callFunction({
            name: "userRegisterController",
            data: {
                openid: openid.value,
                name: name,
                phoneNumber: phoneNumber
            }
        }).then(res => {
            if (res.result.msg == '注册成功') {
                uni.showToast({
                    title: '注册成功！'
                })
                uni.hideLoading()
                setTimeout(() => {
                    uni.redirectTo({
                        url: '/pages/index/index'
                    })
                }, 2000)
            } else {
                uni.showToast({
                    title: '出错！'
                })
            }
        }).catch(err => {
            uni.hideLoading()
            uni.showToast({
                title: '出错！'
            })
            console.log(err)
        })

    }).catch(err => {
        console.log('表单错误信息：', err)
        uni.showToast({
            icon: 'error',
            title: '输入的内容有误',
            duration: 2000
        })
    })
}

onReady(() => {
    registerForm.value.setRules(rules.value)
})

onLoad((option)=>{
    openid.value = option.openid
})
</script>


<style lang="scss" scoped>
.register-form-items {
    margin: 30rpx;
}
</style>