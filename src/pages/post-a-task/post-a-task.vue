<template>
   <view class="content">
    <uni-section title="对齐方式" type="line">
		<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="left">
			

                <view class="test">
                    <uni-forms-item required label="姓名" name="name">
                    <uni-easyinput type="text" v-model="formData.name" placeholder="请输入姓名" />
                    </uni-forms-item>
                </view>
				
			

			<uni-forms-item label="委托类型" name="email">
                <uni-data-select
                        v-model="orderType"
                        :localdata="orderTypeRange"
                        
                    ></uni-data-select> 
			</uni-forms-item>
		</uni-forms>
		<button @click="submit">Submit</button>
    </uni-section>
	</view>
    
</template>

<script setup>
import { ref } from 'vue';

const orderType = ref(0)
const orderTypeRange = ref([
        { value: 1, text: "帮取快递" },
        { value: 2, text: "帮寄快递" },
        { value: 3, text: "帮取外卖" },
        { value: 4, text: "帮送文件" },
        { value: 5, text: "其他" },
      ])



const form = ref(null)
const formData = ref({
    name: 'LiMing',
    email: 'dcloud@email.com'
})
const rules = ref({
    // 对name字段进行必填验证
    name: {
        rules: [{
            required: true,
            errorMessage: '请输入姓名',
        },
        {
            minLength: 3,
            maxLength: 5,
            errorMessage: '姓名长度在 {minLength} 到 {maxLength} 个字符',
        }
        ]
    },
    // 对email字段进行必填验证
    email: {
        rules: [{
            format: 'email',
            errorMessage: '请输入正确的邮箱地址',
        }]
    }
})

function submit() {
			form.value.validate().then(res=>{
				console.log('表单数据信息：', res);
			}).catch(err =>{
				console.log('表单错误信息：', err);
			})
		}


</script>

<style lang="scss" scoped>
@import "./post-a-task.scss";
</style>